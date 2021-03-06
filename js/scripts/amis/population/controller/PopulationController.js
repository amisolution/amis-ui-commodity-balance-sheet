define(['jquery',
        'amis_population/model/PopulationModel',
        'amis_population/creator/PopulationCreator',
        'amis_population/observer/PopulationObserver'],
    function ($, Model, Creator, Observer) {

        'use strict'


        var CONF = {
            "regionCode": 0,
            "regionName": 1,
            "elementCode": 2,
            "elementName": 3,
            "units": 4,
            "value": 6,
            "year": 5,
            "flags": 7,
            "notes": 8,
            "containerID": "gridPopulation"
        }

        var observer, model, creator, componentObserver


        function PopulationController(COMPONENT_OBSERVER) {
            model = new Model(CONF);
            observer = new Observer(this, CONF);
            creator = new Creator(CONF)
            componentObserver = COMPONENT_OBSERVER;
        }


        PopulationController.prototype.init = function () {
            model.init()
            creator.init(model.getModelData())
            observer.applyListeners()
        }


        PopulationController.prototype.updatePopGridOnEditing = function (row, column, value) {

            observer.unbindEventsFromPopulationForm()
            model.setModelData(row, column, value);
            creator.updateRenderingGrid(model.getModelData());
            observer.rebindGridEvents()
        }


        PopulationController.prototype.destroyAll = function () {
            creator.destroyAllForm()
            var root = document.getElementsByTagName('html')[0]; // '0' to assign the first (and only `HTML` tag)
            root.setAttribute("class", "settingOverflow");

        }

        PopulationController.prototype.createNewYear = function () {
            observer.unbindEventsFromPopulationForm()
            model.addNewYearToModel();
            creator.updateRenderingGrid(model.getModelData())
            observer.rebindGridEvents()
        }


        PopulationController.prototype.saveValues = function () {
            model.savePopulationData();
            this.destroyAll()
            componentObserver.reloadNewDataFromPopulationForm();

        }

        PopulationController.prototype.reloadPreviousValues = function () {
            observer.unbindEventsFromPopulationForm()
            creator.updateRenderingGrid(model.restorePreviousData());
            observer.rebindGridEvents()
        }


        return PopulationController;

    })