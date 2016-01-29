
define(['jquery', '../services/configuration/services'], function($, C){


    function ServicesConfigurator(){}

    var configuration

    ServicesConfigurator.prototype.init = function(){

      configuration = C;
    }

    ServicesConfigurator.prototype.getDataSourceUrl = function(){
        if(!configuration){
            this.init()
        }
        return configuration.services[0].filters[0].dataSourceUrl;
    }

    ServicesConfigurator.prototype.getYearUrl = function(){
        if(!configuration){
            this.init()
        }
        return configuration.services[0].filters[1].yearUrl;

    }

    ServicesConfigurator.prototype.getCountryListUrl = function(){
        if(!configuration){
            this.init()
        }
        return configuration.services[0].filters[2].countryUrl;
    }

    ServicesConfigurator.prototype.getCommodityUrl = function(){
        if(!configuration){
            this.init()
        }
        return configuration.services[0].filters[3].commodityUrl;
    }

    ServicesConfigurator.prototype.getAllDataUrl = function(){
        if(!configuration){
            this.init()
        }
        return configuration.services[1].loading[0].loadingElements;
    }

    ServicesConfigurator.prototype.getPopulationUrl = function(){
        if(!configuration){
            this.init()
        }
        return configuration.services[1].loading[1].loadingPopulation;
    }

    ServicesConfigurator.prototype.getMostRecentDateUrl = function(){
        if(!configuration){
            this.init()
        }
        return configuration.services[1].loading[2].mostRecentDate;

    }

    ServicesConfigurator.prototype.getPreviousYearUrl = function(){
        if(!configuration){
            this.init()
        }
        return configuration.services[1].loading[3].previousYear;

    }

    ServicesConfigurator.prototype.getCropsNumberUrl = function(){
        if(!configuration){
            this.init()
        }
        return configuration.services[1].loading[4].numberOfCrops;

    }

    ServicesConfigurator.prototype.getPopulationDataURL = function(){
        if(!configuration){
            this.init()
        }
        return configuration.services[1].loading[5].loadingPopulationData;
    }

    ServicesConfigurator.prototype.getSavingDataUrlWithDate = function(){
        if(!configuration){
            this.init()
        }
        return configuration.services[2].saving.savingWithDate;

    }

    ServicesConfigurator.prototype.getSavingDataUrlWithoutDate = function(){
        if(!configuration){
            this.init()
        }
        return configuration.services[2].saving.savingWithoutDate;

    }

    ServicesConfigurator.prototype.getSavingPopulationURL = function(){
        if(!configuration){
            this.init()
        }
        return configuration.services[2].saving.savingPopulation;

    }



    ServicesConfigurator.prototype.getExportingUrl = function(){
        if(!configuration){
            this.init()
        }
        return configuration.services[3].exportDataServletUrl;
    }

    ServicesConfigurator.prototype.getExportDataServiceUrl = function(){
        if(!configuration){
            this.init()
        }
        return configuration.services[3].exportData;
    };

    ServicesConfigurator.prototype.getSavingAnnualData = function(){
        if(!configuration){
            this.init()
        }
        return configuration.services[2].saving.savingAnnualMode;
    }

    ServicesConfigurator.prototype.getMostRecentExportDate = function(){
        if(!configuration){
            this.init()
        }
        return configuration.services[3].exportMostRecentDate;
    }


    return ServicesConfigurator;
})