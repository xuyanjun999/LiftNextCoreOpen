using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using NPOI.XSSF;
using NPOI.SS;
using NPOI.XSSF.UserModel;
using System.Data;
using NPOI.SS.UserModel;
using System.IO;

namespace LiftNext.Framework.Code.Util.Excel
{
    public class NPOIExcelUtil
    {
        #region 写数据到Excel
        /// <summary>
        /// 将DataTable数据导入到excel中
        /// </summary>
        /// <param name="data">要导入的数据</param>
        /// <param name="isColumnWritten">DataTable的列名是否要导入</param>
        /// <param name="sheetName">要导入的excel的sheet的名称</param>
        /// <returns>导入数据行数(包含列名那一行)</returns>
        public static void Write(DataTable data, string resultPath)
        {
            var workbook = new XSSFWorkbook();

            BuildWorkbook(data, workbook);
            if (File.Exists(resultPath))
            {
                File.Delete(resultPath);
            }
            var stream = File.OpenWrite(resultPath);
            try
            {
                workbook.Write(stream); //写入到excel
            }
            finally
            {
                stream.Dispose();
            }
        }

        /// <summary>
        /// 将DataTable数据导入到excel中
        /// </summary>
        /// <param name="data">要导入的数据</param>
        /// <param name="isColumnWritten">DataTable的列名是否要导入</param>
        /// <param name="sheetName">要导入的excel的sheet的名称</param>
        /// <returns>导入数据行数(包含列名那一行)</returns>
        public static void Write(DataSet ds, string resultPath)
        {
            var workbook = new XSSFWorkbook();

            for (int i = 0; i < ds.Tables.Count; i++)
            {
                DataTable data = ds.Tables[i];

                BuildWorkbook(data, workbook);
            }
            if (File.Exists(resultPath))
            {
                File.Delete(resultPath);
            }
            var stream = File.OpenWrite(resultPath);
            try
            {
                workbook.Write(stream); //写入到excel
            }
            finally
            {
                stream.Dispose();
            }
        }

        static void BuildWorkbook(DataTable data, XSSFWorkbook workbook)
        {
            var sheetName = data.TableName;
            bool isColumnWritten = true;
            int i = 0;
            int j = 0;
            int count = 0;
            ISheet sheet = null;

            #region 构造样式
            ICellStyle titleStyle = workbook.CreateCellStyle();//创建样式对象
            IFont titleFont = workbook.CreateFont(); //创建一个字体样式对象
            titleFont.FontName = "宋体"; //和excel里面的字体对应
            titleFont.IsItalic = false; //斜体
            titleFont.FontHeightInPoints = 10;//字体大小
            titleFont.IsBold = true;
            titleStyle.SetFont(titleFont); //将字体样式赋给样式对象

            ICellStyle bodyStyle = workbook.CreateCellStyle();//创建样式对象
            IFont bodyFont = workbook.CreateFont(); //创建一个字体样式对象
            bodyFont.FontName = "宋体"; //和excel里面的字体对应
            bodyFont.IsItalic = false; //斜体
            bodyFont.FontHeightInPoints = 10;//字体大小
            bodyStyle.SetFont(bodyFont); //将字体样式赋给样式对象
            #endregion

            sheet = workbook.CreateSheet(sheetName);
            if (isColumnWritten == true) //写入DataTable的列名
            {
                IRow row = sheet.CreateRow(0);
                for (j = 0; j < data.Columns.Count; ++j)
                {
                    var cell = row.CreateCell(j);
                    cell.SetCellValue(data.Columns[j].ColumnName);
                    cell.CellStyle = titleStyle; 
                }
                count = 1;
            }
            else
            {
                count = 0;
            }

            for (i = 0; i < data.Rows.Count; ++i)
            {
                IRow row = sheet.CreateRow(count);
                for (j = 0; j < data.Columns.Count; ++j)
                {
                    var cell = row.CreateCell(j);
                    cell.SetCellValue(data.Rows[i][j].ToString());
                    cell.CellStyle = bodyStyle;
                }
                ++count;
            }
        }
        #endregion

        #region 导出实体数据
        /// <summary>
        /// 导出实体数据
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="data"></param>
        /// <param name="tableName"></param>
        /// <param name="columns"></param>
        /// <param name="resultPath"></param>
        public static void ExportEntityData<T>(T[] data, string tableName,IEnumerable<string> columns, string resultPath)
        {
            if (data == null || data.Length <= 0) throw new Exception("导出的数据不能为空!");

            DataTable dt = new DataTable();
            dt.TableName = tableName;
            foreach (var column in columns)
            {
                string desc = ReflectionUtil.GetPropertyDescWithDeep(data.FirstOrDefault(), column);
                if (string.IsNullOrEmpty(desc))
                {
                    dt.Columns.Add(column);
                }
                else
                {
                    dt.Columns.Add(desc);
                }
            }
            foreach (var item in data)
            {
                DataRow row = dt.NewRow();

                foreach (var column in columns)
                {
                    string desc = ReflectionUtil.GetPropertyDescWithDeep(item, column);
                    var value = ReflectionUtil.GetPropertyValueWithDeep(item, column);
                    if (string.IsNullOrEmpty(desc))
                    {
                        row[column] = value;
                    }
                    else
                    {
                        row[desc] = value;
                    }
                }

                dt.Rows.Add(row);
            }

            Write(dt, resultPath);

        }
        #endregion

        #region 读数据
        /// <summary>
        /// 将excel中的数据导入到DataTable中
        /// </summary>
        /// <param name="sheetName">excel工作薄sheet的名称</param>
        /// <param name="isFirstRowColumn">第一行是否是DataTable的列名</param>
        /// <returns>返回的DataTable</returns>
        public static DataTable Read(string filePath, string sheetName)
        {
            bool isFirstRowColumn = true;
            ISheet sheet = null;
            DataTable data = new DataTable();
            int startRow = 0;


            var workbook = new XSSFWorkbook(filePath);

            sheet = workbook.GetSheet(sheetName);

            if (sheet != null)
            {
                IRow firstRow = sheet.GetRow(0);
                int cellCount = firstRow.LastCellNum; //一行最后一个cell的编号 即总的列数

                if (isFirstRowColumn)
                {
                    for (int i = firstRow.FirstCellNum; i < cellCount; ++i)
                    {
                        ICell cell = firstRow.GetCell(i);
                        if (cell != null)
                        {
                            string cellValue = cell.StringCellValue;
                            if (cellValue != null)
                            {
                                DataColumn column = new DataColumn(cellValue);
                                data.Columns.Add(column);
                            }
                        }
                    }
                    startRow = sheet.FirstRowNum + 1;
                }
                else
                {
                    startRow = sheet.FirstRowNum;
                }

                //最后一列的标号
                int rowCount = sheet.LastRowNum;
                for (int i = startRow; i <= rowCount; ++i)
                {
                    IRow row = sheet.GetRow(i);
                    if (row == null) continue; //没有数据的行默认是null　　　　　　　

                    DataRow dataRow = data.NewRow();
                    for (int j = row.FirstCellNum; j < cellCount; ++j)
                    {
                        if (row.GetCell(j) != null) //同理，没有数据的单元格都默认是null
                            dataRow[j] = row.GetCell(j).ToString();
                    }
                    data.Rows.Add(dataRow);
                }
            }
            workbook.Close();
            workbook = null;
            return data;

        }
        #endregion

        #region 读数据
        /// <summary>
        /// 将excel中的数据导入到DataTable中
        /// </summary>
        /// <param name="sheetName">excel工作薄sheet的名称</param>
        /// <param name="isFirstRowColumn">第一行是否是DataTable的列名</param>
        /// <returns>返回的DataTable</returns>
        public static DataTable Read(string filePath, int sheetIndex)
        {
            bool isFirstRowColumn = true;
            ISheet sheet = null;
            DataTable data = new DataTable();
            int startRow = 0;


            var workbook = new XSSFWorkbook(filePath);

            sheet = workbook.GetSheetAt(sheetIndex);

            if (sheet != null)
            {
                data.TableName = sheet.SheetName;

                IRow firstRow = sheet.GetRow(0);
                int cellCount = firstRow.LastCellNum; //一行最后一个cell的编号 即总的列数

                if (isFirstRowColumn)
                {
                    for (int i = firstRow.FirstCellNum; i < cellCount; ++i)
                    {
                        ICell cell = firstRow.GetCell(i);
                        if (cell != null)
                        {
                            string cellValue = cell.StringCellValue;
                            if (cellValue != null)
                            {
                                DataColumn column = new DataColumn(cellValue);
                                data.Columns.Add(column);
                            }
                        }
                    }
                    startRow = sheet.FirstRowNum + 1;
                }
                else
                {
                    startRow = sheet.FirstRowNum;
                }

                //最后一列的标号
                int rowCount = sheet.LastRowNum;
                for (int i = startRow; i <= rowCount; ++i)
                {
                    IRow row = sheet.GetRow(i);
                    if (row == null) continue; //没有数据的行默认是null　　　　　　　

                    DataRow dataRow = data.NewRow();
                    for (int j = row.FirstCellNum; j < cellCount; ++j)
                    {
                        if (row.GetCell(j) != null) //同理，没有数据的单元格都默认是null
                            dataRow[j] = row.GetCell(j).ToString();
                    }
                    data.Rows.Add(dataRow);
                }
            }
            workbook.Close();
            workbook = null;
            return data;
        }
        #endregion
    }

}

