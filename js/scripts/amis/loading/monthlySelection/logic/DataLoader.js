define(["jquery", "formatter/DatatypesFormatter", "urlConfigurator", "amplify"], function ($, Formatter, ServicesURL) {


    var urlActualForecast , urlPopulation , urlMostRecentDate, urlPreviousYear, firstForecastDateToInsert,
        formatter, realPreviousDate, Services;


    function DataLoader() {
        formatter = new Formatter;
        Services = new ServicesURL;
        Services.init()

        urlActualForecast = Services.getAllDataUrl()
        urlPopulation = Services.getPopulationUrl();
        urlMostRecentDate = Services.getMostRecentDateUrl();
        urlPreviousYear = Services.getPreviousYearUrl();

    }


    DataLoader.prototype.getActualYearForecast = function (filterActual, filterPopulationActual, isDateFormatted) {

        var actualForecast;
        // first call
        $.ajax({
            async: false,
            url: urlActualForecast,
            type: 'POST',
            contentType: "application/json",
            dataType: 'json',
            data: JSON.stringify(filterActual)

        }).done(function (result) {
            actualForecast = result;
        })

        var setDatesUnique = {}
        if (isDateFormatted) {
            // Put dates in DSD format
            for (var i = 0; i < actualForecast.length; i++) {
                var data = actualForecast[i][2]

                actualForecast[i][2] = formatter.fromVisualizationToDSDFormat(data, "date")
                this.putIfNotExists(actualForecast[i][2],setDatesUnique,i);
            }
        } else {

            // Put dates in DSD format
            for (var i = 0; i < actualForecast.length; i++) {
                var data = actualForecast[i][2]
                this.putIfNotExists(data,setDatesUnique,i);
            }
        }

        var populationActual;
        // Second call with actual population
        $.ajax({
            async: false,
            url: urlPopulation,
            type: 'POST',
            contentType: "application/json",
            dataType: 'json',
            data: JSON.stringify(filterPopulationActual)

        }).done(function (result) {
            populationActual = result;
        })

        // Inside of population insert the date(s)

        // Look for every date and put inside of each the population product

        this.putDateInEveryForecast(setDatesUnique,actualForecast,populationActual)

        return actualForecast;
    }


    DataLoader.prototype.getPreviousYearForecast = function (mostRecentDateFilter, filterPreviousYear, filterPrevPopulation, isDateFormatted, preloadingData) {
        var dates, prevYearForecast,
            filter = filterPreviousYear;
        $.ajax({
            async: false,
            url: urlMostRecentDate,
            type: 'POST',
            contentType: "application/json",
            dataType: 'json',
            data: JSON.stringify(filter)

        }).done(function (result) {
            dates = result;
        })

        if (dates.length>0) {
            var mostRecentDate = dates[dates.length - 1][0]
            // set the most recent date to make the query
            filterPreviousYear["date"] = mostRecentDate;

            var prevYearForecast
            $.ajax({
                async: false,
                url: urlPreviousYear,
                type: 'POST',
                contentType: "application/json",
                dataType: 'json',
                data: JSON.stringify(filterPreviousYear)

            }).done(function (result) {
                prevYearForecast = result;
            })

            var fakeData
            if (isDateFormatted) {
                // Put dates in DSD format
                realPreviousDate = prevYearForecast[0][2]
                for (var i = 0; i < prevYearForecast.length; i++) {
                    fakeData = "20000103"
                    prevYearForecast[i][2] = fakeData;

                    // also for updateDate
                }
            } else {
                var previousSeason = preloadingData.years.previousYearLabel;

                for (var i = 0; i < prevYearForecast.length; i++) {
                    prevYearForecast[i][2] = previousSeason;
                }
            }

            var populationPrevYear;
            $.ajax({
                async: false,
                url: urlPopulation,
                type: 'POST',
                contentType: "application/json",
                dataType: 'json',
                data: JSON.stringify(filterPrevPopulation)
            }).done(function (result) {
                populationPrevYear = result;
            })


            // Inside of population insert the date(s)

            if (populationPrevYear.length > 0) {
                if (isDateFormatted) {

                    populationPrevYear[0].splice(2, 0, fakeData);
                    populationPrevYear[0].push(null);

                } else {
                    populationPrevYear[0].splice(2, 0, previousSeason);
                    populationPrevYear[0].push(null);
                }

                // Insert population into actual forecast
                prevYearForecast.push(populationPrevYear[0])
            }
        } else {
            alert('no data found into db for the previous season: please, change your selection');
        }
        return prevYearForecast;
    }


    DataLoader.prototype.checkIfEqualForecastDates = function (firstActForecast, prevForecast) {
        return firstActForecast[2] == prevForecast[2]
    }


    DataLoader.prototype.setFakeForecastDate = function (prevYearForecast) {
        realPreviousDate = prevYearForecast[0][2]
        var fakeDate = "20000103";
        prevYearForecast[i][2] = fakeDate;

        return prevYearForecast;
    }


    DataLoader.prototype.setSeasonInsteadOfDate = function (prevYearForecast, previousSeason) {

        for (var i = 0; i < prevYearForecast.length; i++) {
            prevYearForecast[i][2] = previousSeason;
        }
        return prevYearForecast;
    }


    DataLoader.prototype.getRealPreviousYear = function () {
        return realPreviousDate;
    }


    DataLoader.prototype.putIfNotExists = function(elementToPut, setObject,indexElementToPut){

        if(!setObject.hasOwnProperty(elementToPut)){
            setObject[elementToPut] = indexElementToPut
        }
    }


    DataLoader.prototype.putDateInEveryForecast = function(setDatesObject, forecast, population){
        // if there is a new forecast
        if(!($.isEmptyObject(setDatesObject))) {
            for (var date in setDatesObject) {
                var populationCopy = $.extend(true, [], population)
                if (populationCopy.length > 0) {
                    populationCopy[0].splice(2, 0, date);
                    forecast.splice([setDatesObject[date]], 0, populationCopy[0])
                }
            }
        }else{
            amplify.store('population_new_forecast', population[0])
        }
    }


    return DataLoader;

})