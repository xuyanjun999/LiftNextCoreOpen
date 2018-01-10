using LiftNext.Framework.Code.Infrastructure;
using LiftNext.Framework.Mvc.Framework.Mvc.Filters;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Cors.Internal;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using System;
using System.Collections.Generic;
using System.Text;

namespace LiftNext.Framework.Mvc.Framework.Infrastructure.Extensions
{
    /// <summary>
    /// Represents extensions of IServiceCollection
    /// </summary>
    public static class ServiceCollectionExtensions
    {
        /// <summary>
        /// Add services to the application and configure service provider
        /// </summary>
        /// <param name="services">Collection of service descriptors</param>
        /// <param name="configuration">Configuration root of the application</param>
        /// <returns>Configured service provider</returns>
        public static void ConfigureApplicationServices(this IServiceCollection services, IConfiguration configuration)
        {
            //add NopConfig configuration parameters
            //services.ConfigureStartupConfig<NopConfig>(configuration.GetSection("Nop"));
            //add hosting configuration parameters
            //services.ConfigureStartupConfig<HostingConfig>(configuration.GetSection("Hosting"));
            //add accessor to HttpContext
            services.AddHttpContextAccessor();

            //create, initialize and configure the engine
            var engine = EngineContext.Create();
            engine.Initialize(services);
            engine.ConfigureServices(services, configuration);

            // if (DataSettingsHelper.DatabaseIsInstalled())
            // {
            //implement schedule tasks
            //database is already installed, so start scheduled tasks
            //    TaskManager.Instance.Initialize();
            //   TaskManager.Instance.Start();

            //log application start
            // EngineContext.Current.Resolve<ILogger>().LogInformation("Application started", null, null);
            // }

            //return serviceProvider;
        }

        /// <summary>
        /// Create, bind and register as service the specified configuration parameters 
        /// </summary>
        /// <typeparam name="TConfig">Configuration parameters</typeparam>
        /// <param name="services">Collection of service descriptors</param>
        /// <param name="configuration">Set of key/value application configuration properties</param>
        /// <returns>Instance of configuration parameters</returns>
        public static TConfig ConfigureStartupConfig<TConfig>(this IServiceCollection services, IConfiguration configuration) where TConfig : class, new()
        {
            if (services == null)
                throw new ArgumentNullException(nameof(services));

            if (configuration == null)
                throw new ArgumentNullException(nameof(configuration));

            //create instance of config
            var config = new TConfig();

            //bind it to the appropriate section of configuration
            //configuration.Bind(config);

            //and register it as a service
            services.AddSingleton(config);

            return config;
        }

        /// <summary>
        /// Register HttpContextAccessor
        /// </summary>
        /// <param name="services">Collection of service descriptors</param>
        public static void AddHttpContextAccessor(this IServiceCollection services)
        {
            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
        }

        /// <summary>
        /// Adds services required for anti-forgery support
        /// </summary>
        /// <param name="services">Collection of service descriptors</param>
        public static void AddAntiForgery(this IServiceCollection services)
        {
            //override cookie name
            services.AddAntiforgery(options =>
            {
                options.Cookie.Name = ".Nop.Antiforgery";
            });
        }

        /// <summary>
        /// Adds services required for application session state
        /// </summary>
        /// <param name="services">Collection of service descriptors</param>
        public static void AddHttpSession(this IServiceCollection services,IConfiguration configuration)
        {

            //services.AddDistributedRedisCache(option =>
            //{
            //    //redis 数据库连接字符串
            //    option.Configuration = configuration.GetConnectionString("redis");
            //    //redis 实例名
            //    option.InstanceName = "eapcore";
            //});

            services.AddSession(options =>
            {
                options.Cookie.Name = ".Eap.Session";
                options.Cookie.HttpOnly = true;
            });
        }



        /// <summary>
        /// Adds authentication service
        /// </summary>
        /// <param name="services">Collection of service descriptors</param>
        public static void AddNopAuthentication(this IServiceCollection services)
        {
            ////set default authentication schemes
            //var authenticationBuilder = services.AddAuthentication(options =>
            //{
            //    options.DefaultChallengeScheme = NopCookieAuthenticationDefaults.AuthenticationScheme;
            //    options.DefaultSignInScheme = NopCookieAuthenticationDefaults.ExternalAuthenticationScheme;
            //});

            ////add main cookie authentication
            //authenticationBuilder.AddCookie(NopCookieAuthenticationDefaults.AuthenticationScheme, options =>
            //{
            //    options.Cookie.Name = NopCookieAuthenticationDefaults.CookiePrefix + NopCookieAuthenticationDefaults.AuthenticationScheme;
            //    options.Cookie.HttpOnly = true;
            //    options.LoginPath = NopCookieAuthenticationDefaults.LoginPath;
            //    options.AccessDeniedPath = NopCookieAuthenticationDefaults.AccessDeniedPath;
            //});

            ////add external authentication
            //authenticationBuilder.AddCookie(NopCookieAuthenticationDefaults.ExternalAuthenticationScheme, options =>
            //{
            //    options.Cookie.Name = NopCookieAuthenticationDefaults.CookiePrefix + NopCookieAuthenticationDefaults.ExternalAuthenticationScheme;
            //    options.Cookie.HttpOnly = true;
            //    options.LoginPath = NopCookieAuthenticationDefaults.LoginPath;
            //    options.AccessDeniedPath = NopCookieAuthenticationDefaults.AccessDeniedPath;
            //});

            ////register and configure external authentication plugins now
            //var typeFinder = new WebAppTypeFinder();
            //var externalAuthConfigurations = typeFinder.FindClassesOfType<IExternalAuthenticationRegistrar>();
            //var externalAuthInstances = externalAuthConfigurations
            //    .Where(x => PluginManager.FindPlugin(x)?.Installed ?? true) //ignore not installed plugins
            //    .Select(x => (IExternalAuthenticationRegistrar)Activator.CreateInstance(x));

            //foreach (var instance in externalAuthInstances)
            //    instance.Configure(authenticationBuilder);
        }

        /// <summary>
        /// Add and configure MVC for the application
        /// </summary>
        /// <param name="services">Collection of service descriptors</param>
        /// <returns>A builder for configuring MVC services</returns>
        public static IMvcBuilder AddEapMvc(this IServiceCollection services)
        {

            services.AddCors(options =>
            {
                options.AddPolicy("AllowAnyOrigin",
                    builder => builder
                    .AllowAnyOrigin()
                    .AllowAnyMethod()
                    .AllowAnyHeader());
            });

            services.Configure<MvcOptions>(options => {
                options.Filters.Add(new CorsAuthorizationFilterFactory("AllowAnyOrigin"));
            });

            //add basic MVC feature
            var mvcBuilder = services.AddMvc(opt =>
            {
                opt.Filters.Add(typeof(MyExceptionFilter));
               // opt.Filters.Add(typeof(LoginFilter));
            });

            mvcBuilder.AddJsonOptions(opt =>
            {
                opt.SerializerSettings.Formatting = Formatting.Indented;
                //opt.SerializerSettings.NullValueHandling = NullValueHandling.Ignore;
                opt.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
                opt.SerializerSettings.DateFormatHandling = DateFormatHandling.IsoDateFormat;
                opt.SerializerSettings.ContractResolver = new DefaultContractResolver { NamingStrategy = new DefaultNamingStrategy() };
            });

            services.Configure<FormOptions>(x => {
                x.ValueLengthLimit = int.MaxValue;
                x.MultipartBodyLengthLimit = int.MaxValue;
            });

           // services.AddCors();


            //services.Configure<MvcOptions>(options =>
            //{
            //    options.Filters.Add(new CorsAuthorizationFilterFactory("AllowSpecificOrigin"));
            //});

            //use session temp data provider
            // mvcBuilder.AddSessionStateTempDataProvider();

            //MVC now serializes JSON with camel case names by default, use this code to avoid it
            // mvcBuilder.AddJsonOptions(options => options.SerializerSettings.ContractResolver = new DefaultContractResolver());

            //add custom display metadata provider
            // mvcBuilder.AddMvcOptions(options => options.ModelMetadataDetailsProviders.Add(new NopMetadataProvider()));

            //add custom model binder provider (to the top of the provider list)
            // mvcBuilder.AddMvcOptions(options => options.ModelBinderProviders.Insert(0, new NopModelBinderProvider()));

            //add global exception filter
            // mvcBuilder.AddMvcOptions(options => options.Filters.Add(new ExceptionFilter()));

            //add fluent validation
            // mvcBuilder.AddFluentValidation(configuration => configuration.ValidatorFactoryType = typeof(NopValidatorFactory));

            return mvcBuilder;
        }


    }
}
