using OfficeOpenXml;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Text;
using System.Linq;

namespace LiftNext.Framework.Code.Util.Excel
{
    public class EPPlusExcelUtil
    {
        #region 读数据
        /// <summary>
        /// 将excel中的数据导入到DataTable中
        /// </summary>
        /// <param name="sheetName">excel工作薄sheet的名称</param>
        /// <param name="isFirstRowColumn">第一行是否是DataTable的列名</param>
        /// <returns>返回的DataTable</returns>
        public static DataTable Read(string filePath, string sheetName)
        {
            DataTable dt = new DataTable();
            using (ExcelPackage package = new ExcelPackage(new FileInfo(filePath)))
            {
                StringBuilder sb = new StringBuilder();
                ExcelWorksheet worksheet = package.Workbook.Worksheets[sheetName];
                int rowCount = worksheet.Dimension.Rows;
                int ColCount = worksheet.Dimension.Columns;
                for (int row = 1; row <= rowCount; row++)
                {
                    DataRow dataRow = dt.NewRow();
                    for (int col = 1; col <= ColCount; col++)
                    {
                        if (row == 1)
                        {
                            DataColumn headerColumn = new DataColumn(worksheet.Cells[row, col].Value?.ToString());
                            dt.Columns.Add(headerColumn);
                            continue;
                        }
                        else
                        {
                            dataRow[col - 1] = worksheet.Cells[row, col].Value?.ToString();

                        }
                    }
                    if (row != 1) dt.Rows.Add(dataRow);


                }

            }
            return dt;

        }
        #endregion

        #region  写数据
        public static void Write(DataTable dt, string filePath)
        {
            var sheetName = string.IsNullOrWhiteSpace(dt.TableName) ? "sheet1" : dt.TableName;
            using (ExcelPackage package = new ExcelPackage(new FileInfo(filePath)))
            {
                // add a new worksheet
                ExcelWorksheet worksheet = package.Workbook.Worksheets.Add(sheetName);

                WriteSheet(dt, worksheet);
                package.Save(); //Save the workbook.
            }
        }
        #endregion

        #region 写数据
        /// <summary>
        /// 写数据
        /// </summary>
        /// <param name="dt"></param>
        /// <param name="worksheet"></param>
        private static void WriteSheet(DataTable dt, ExcelWorksheet worksheet)
        {
            for (int i = 0; i < dt.Columns.Count; i++)
            {
                worksheet.Cells[1, i + 1].Value = dt.Columns[i].ColumnName;
            }
            for (int i = 0; i < dt.Rows.Count; i++)
            {
                for (int j = 0; j < dt.Columns.Count; j++)
                {
                    worksheet.Cells[i + 2, j + 1].Value = dt.Rows[i][j];
                }

            }
        }
        #endregion

        #region  写数据
        public static void Write(DataSet ds, string filePath)
        {
            using (ExcelPackage package = new ExcelPackage(new FileInfo(filePath)))
            {
                int index = 1;
                foreach (DataTable dt in ds.Tables)
                {
                    var sheetName = string.IsNullOrWhiteSpace(dt.TableName) ? $"sheet{index}" : dt.TableName;
                    // add a new worksheet
                    ExcelWorksheet worksheet = package.Workbook.Worksheets.Add(sheetName);

                    WriteSheet(dt, worksheet);

                    index++;
                    //Save the workbook.
                }
                package.Save();
            }
        }
        #endregion

        #region  标签替换
        /// <summary>
        /// 标签替换
        /// </summary>
        /// <param name="srcFilePath"></param>
        /// <param name="resultFilePath"></param>
        /// <param name="dictionary"></param>
        public static void TagReplace(string srcFilePath, string resultFilePath, Dictionary<string, string> dictionary, string sheetName)
        {
            using (ExcelPackage package = new ExcelPackage(new FileInfo(srcFilePath)))
            {
                StringBuilder sb = new StringBuilder();
                ExcelWorksheet worksheet = package.Workbook.Worksheets[sheetName];
                TagReplace(worksheet, dictionary);
                package.SaveAs(new FileInfo(resultFilePath));
            }
        }
        #endregion

        #region  标签替换
        /// <summary>
        /// 标签替换
        /// </summary>
        /// <param name="srcFilePath"></param>
        /// <param name="resultFilePath"></param>
        /// <param name="dictionary"></param>
        /// <param name="sheetIndex">sheet表的索引 索引从1开始</param>
        public static void TagReplace(string srcFilePath, string resultFilePath, Dictionary<string, string> dictionary, int sheetIndex)
        {
            using (ExcelPackage package = new ExcelPackage(new FileInfo(srcFilePath)))
            {
                StringBuilder sb = new StringBuilder();
                ExcelWorksheet worksheet = package.Workbook.Worksheets[sheetIndex];
                TagReplace(worksheet, dictionary);
                package.SaveAs(new FileInfo(resultFilePath));
            }
        }
        #endregion

        #region  标签替换
        /// <summary>
        /// 标签替换
        /// </summary>
        /// <param name="worksheet"></param>
        /// <param name="dictionary"></param>
        private static void TagReplace(ExcelWorksheet worksheet, Dictionary<string, string> dictionary)
        {
            int rowCount = worksheet.Dimension.Rows;
            int colCount = worksheet.Dimension.Columns;
            for (int row = 1; row <= rowCount; row++)
            {
                for (int col = 1; col <= colCount; col++)
                {
                    string cellValue = worksheet.Cells[row, col].Value?.ToString();
                    if (!string.IsNullOrWhiteSpace(cellValue))
                    {
                        var value = ReplaceString(cellValue, dictionary);
                        if (cellValue != value)
                        {
                            worksheet.Cells[row, col].Value = value;
                        }

                    }
                }
            }
        }
        #endregion

        #region 替换string
        /// <summary>
        /// 替换string
        /// </summary>
        /// <param name="value"></param>
        /// <param name="dictionary"></param>
        /// <returns></returns>
        private static string ReplaceString(string value, Dictionary<string, string> dictionary)
        {

            foreach (var kv in dictionary)
            {
                if (value.Contains(kv.Key))
                {
                    value = value.Replace(kv.Key, kv.Value);
                }
            }
            return value;
        }
        #endregion

        #region  标签替换和删除多余行
        /// <summary>
        /// 
        /// </summary>
        /// <param name="srcFilePath"></param>
        /// <param name="resultFilePath"></param>
        /// <param name="dictionary"></param>
        /// <param name="sheetName"></param>
        /// <param name="deleteRowIndex">索引从一开始</param>
        /// <param name="deleteRowCount"></param>
        public static void TagReplaceAndDeleteRows(string srcFilePath, string resultFilePath, Dictionary<string, string> dictionary, string sheetName, int deleteRowIndex, int deleteRowCount, bool shiftOtherRowsUp = true)
        {
            using (ExcelPackage package = new ExcelPackage(new FileInfo(srcFilePath)))
            {
                StringBuilder sb = new StringBuilder();
                ExcelWorksheet worksheet = package.Workbook.Worksheets[sheetName];
                TagReplace(worksheet, dictionary);
                DeteleRows(worksheet, deleteRowIndex, deleteRowCount, shiftOtherRowsUp);
                package.SaveAs(new FileInfo(resultFilePath));
            }
        }
        #endregion

        #region  标签替换和删除多余行
        /// <summary>
        /// 
        /// </summary>
        /// <param name="srcFilePath"></param>
        /// <param name="resultFilePath"></param>
        /// <param name="dictionary"></param>
        /// <param name="sheetIndex">索引从一开始</param>
        /// <param name="deleteRowIndex">索引从一开始</param>
        /// <param name="deleteRowCount"></param>
        public static void TagReplaceAndDeleteRows(string srcFilePath, string resultFilePath, Dictionary<string, string> dictionary, int sheetIndex, int deleteRowIndex, int deleteRowCount, bool shiftOtherRowsUp = true)
        {
            using (ExcelPackage package = new ExcelPackage(new FileInfo(srcFilePath)))
            {
                StringBuilder sb = new StringBuilder();
                ExcelWorksheet worksheet = package.Workbook.Worksheets[sheetIndex];
                TagReplace(worksheet, dictionary);
                DeteleRows(worksheet, deleteRowIndex, deleteRowCount, shiftOtherRowsUp);
                package.SaveAs(new FileInfo(resultFilePath));
            }
        }
        #endregion

        #region  标签替换和删除多余行
        /// <summary>
        /// 
        /// </summary>
        /// <param name="srcFilePath"></param>
        /// <param name="resultFilePath"></param>
        /// <param name="dictionary"></param>
        /// <param name="sheetIndex">索引从一开始</param>
        /// <param name="deleteRowIndex">索引从一开始</param>
        /// <param name="deleteRowCount"></param>
        public static void TagReplaceAndDeleteRows(string srcFilePath, string resultFilePath, Dictionary<string, string> dictionary, int sheetIndex, string deleteTag, bool shiftOtherRowsUp = true)
        {
            using (ExcelPackage package = new ExcelPackage(new FileInfo(srcFilePath)))
            {
                StringBuilder sb = new StringBuilder();
                ExcelWorksheet worksheet = package.Workbook.Worksheets[sheetIndex];
                TagReplace(worksheet, dictionary);
                DeteleRows(worksheet, deleteTag, shiftOtherRowsUp);
                package.SaveAs(new FileInfo(resultFilePath));
            }
        }
        #endregion

        #region  删除指定行
        /// <summary>
        /// 标签替换
        /// </summary>
        /// <param name="worksheet"></param>
        /// <param name="dictionary"></param>
        private static void DeteleRows(ExcelWorksheet worksheet, int rowIndex, int rowCount, bool shiftOtherRowsUp = true)
        {
            worksheet.DeleteRow(rowIndex, rowCount, shiftOtherRowsUp);
        }
        #endregion

        #region  删除指定行
        /// <summary>
        /// 删除指定行
        /// </summary>
        /// <param name="worksheet"></param>
        /// <param name="dictionary"></param>
        private static void DeteleRows(ExcelWorksheet worksheet, string deleteTag, bool shiftOtherRowsUp = true)
        {
            int rowCount = worksheet.Dimension.Rows;
            int ColCount = worksheet.Dimension.Columns;
            List<int> needDeleteRows = new List<int>();
            for (int row = 1; row <= rowCount; row++)
            {
                string cellValue = worksheet.Cells[row, 1].Value?.ToString();
                if (cellValue != null && cellValue.Trim() == deleteTag.Trim())
                {
                    needDeleteRows.Add(row);
                }
            }
            for (int i = 0; i < needDeleteRows.Count; i++)
            {
                worksheet.DeleteRow(needDeleteRows[i] - i);
            }

        }
        #endregion
    }
}
