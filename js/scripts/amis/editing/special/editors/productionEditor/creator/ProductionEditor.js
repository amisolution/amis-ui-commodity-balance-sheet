/**
 * Created by fabrizio on 9/13/14.
 */
define(["jquery", "formatter/DatatypesFormatter", "productionEditor/observer/ProductionObserver",
        "productionEditor/model/ProductionModel", "specialFormulaConf/formulaHandler/FormulaHandler",
        "productionEditor/controller/ProductionController", "text!productionEditor/view/_productionForm.html", "flagTranslator/controller/FlagController",
        "text!productionEditor/view/_alertSelection.html", "select2"],
    function ($, Formatter, Observer, ModelProduction, FormulaHandler, Controller, HTLMProduction, FlagController, AlertSelection) {


        // ---------------------- SUPPORT FUNCTIONS -------------------------------------------

        Element.prototype.remove = function () {
            this.parentElement.removeChild(this);
        }

        NodeList.prototype.remove = HTMLCollection.prototype.remove = function () {
            for (var i = 0, len = this.length; i < len; i++) {
                if (this[i] && this[i].parentElement) {
                    this[i].parentElement.removeChild(this[i]);
                }
            }
        }
        // ------------------------------------------------------------------------------------


        var observer, modelProduction, supportUtility, formulaHandler, originalTotCropsModel, productionController, controllerEditors,
            flagController, modal, formulaToRenderTotVal, formulaToRenderSingleCrops, areaHarvSelected, callbackStyleTotGrid, callbackStyleSingleGrid,
            that, callbackMultiFlagCreation, callbackMultiFlagInit, callbackMultiFlagGetValues, alertSelection


        function ProductionEditor() {
            that = this;
            alertSelection = AlertSelection
            observer = new Observer;
            modelProduction = new ModelProduction;
            formulaHandler = new FormulaHandler;
            productionController = new Controller;
            flagController = new FlagController;
            modal = HTLMProduction
            areaHarvSelected = true;

            callbackStyleTotGrid = function (row, column, value, data) {
                return that.createStyleClassGridTotal(row, column, value, data)
            }

            callbackStyleSingleGrid = function (row, column, value, data) {
                return that.createStyleClassGridSingle(row, column, value, data)
            }

            callbackMultiFlagCreation = function (row, cellValue, editor, cellText, width, height) {
                that.createMultiFlagEditor(row, cellValue, editor, cellText, width, height)
            }

            callbackMultiFlagInit = function (row, cellValue, editor, cellText, width, height) {
                that.createMultiFlagInit(row, cellValue, editor, cellText, width, height)
            }

            callbackMultiFlagGetValues = function (row, cellValue, editor) {
                return that.getFromMultiFlag(row, cellValue, editor);
            }

        }

        ProductionEditor.prototype.init = function (clickedItem, itemsInvolved, codesInvolved, configurator, Utility, ControllerEditors) {
            controllerEditors = ControllerEditors;

            var involvedItems = $.extend(true, [], itemsInvolved);
            supportUtility = Utility;

            // take data and calculate initial formulas
            originalTotCropsModel = modelProduction.getTotalCropsModel(involvedItems, supportUtility);
            productionController.init(this, formulaHandler, modelProduction)

            var copyOriginalModelTot = $.extend(true, [], originalTotCropsModel);

            var formulaTotCrops = formulaHandler.getInitFormulaFromConf(1, 'totalValues')
            var totalCropsCalc = formulaHandler.createFormula(copyOriginalModelTot, formulaTotCrops)

            var singleCropsModel = modelProduction.getSingleCropsModel(involvedItems, supportUtility);
            var copyOriginalModelSingle = $.extend(true, [], singleCropsModel);

            formulaToRenderTotVal = 'init'
            formulaToRenderSingleCrops = 'init'

            console.log('InovolvedItems')
            console.log(involvedItems)

            var source = {
                datatype: "array",
                datafields: [
                    { name: 6, type: 'string' },
                    { name: 7, type: 'string' },
                    { name: 3, type: 'float' },
                    { name: 4, type: 'string'},
                    {name: 5, type: 'string'}
                ],
                id: 'ppp',
                localdata: totalCropsCalc
            };

            var source2 = {
                datatype: "array",
                datafields: [
                    { name: 6, type: 'string' },
                    { name: 7, type: 'string' },
                    { name: 3, type: 'float' },
                    { name: 4, type: 'string'},
                    { name: 5, type: 'string'}
                ],
                id: 'ppp',
                localdata: copyOriginalModelSingle
            };

            var dataAdapter = new $.jqx.dataAdapter(source);
            var dataAdapter2 = new $.jqx.dataAdapter(source2);

            var f = document.getElementById("specialForm");

            if (f !== null) {
                f.remove()
            }


            $("#pivotGrid").append(modal);
            $('#firstCheckBoxTotVal').jqxCheckBox({ width: 120, height: 25, checked: true});
            $('#secondCheckBoxTotVal').jqxCheckBox({ width: 120, height: 25, checked: true});
            $('#thirdCheckBoxTotVal').jqxCheckBox({ width: 120, height: 25, disabled: true });


            $('#firstCheckBoxSingleCrops').jqxCheckBox({ width: 120, height: 25, checked: true});
            $('#secondCheckBoxSingleCrops').jqxCheckBox({ width: 120, height: 25, checked: true});
            $('#thirdCheckBoxSingleCrops').jqxCheckBox({ width: 120, height: 25, disabled: true });

            $('#radioBtnAreaHarv').jqxRadioButton({ width: 120, height: 25, groupName: "totValueBtn", checked: true });
            $('#radioBtnAreaPlanted').jqxRadioButton({ width: 120, groupName: "totValueBtn", height: 25 });

            $('#radioBtnAreaHarvSingleCrops').jqxRadioButton({ width: 120, height: 25, groupName: "singleCropsBtn", checked: true });
            $('#radioBtnAreaPltdSingleCrops').jqxRadioButton({ width: 120, height: 25, groupName: "singleCropsBtn"});

            var that = this;

            $('#gridTotalValues').jqxGrid({
                source: dataAdapter,
                width: "100%",
                editable: true,
                rowsheight: 40,
                selectionmode: 'singlecell',
                pageable: true,
                autoheight: true,
                columns: [
                    { text: 'Element', datafield: 6, cellclassname: callbackStyleTotGrid, width: '25%' },
                    { text: 'Value', datafield: 3, cellclassname: callbackStyleTotGrid, width: '15%'},
                    { text: 'Flags', datafield: 4, cellclassname: callbackStyleTotGrid, width: '25%',
                        createeditor: callbackMultiFlagCreation, initeditor: callbackMultiFlagInit, geteditorvalue: callbackMultiFlagGetValues, heigth: 250
                    },
                    { text: 'Notes', datafield: 5, cellclassname: callbackStyleTotGrid, width: '35%'}
                ]
            });

            $('#gridSingleCrops').jqxGrid({
                autorowheight: true,
                source: dataAdapter2,
                width: "100%",
                editable: true,
                selectionmode: 'singlecell',
                pageable: true,
                autoheight: true,
                columns: [
                    { text: 'Element', datafield: 6, cellclassname: callbackStyleSingleGrid, width: '40%' },
                    { text: 'Crop', datafield: 7, cellclassname: callbackStyleSingleGrid, width: '20%' },
                    { text: 'Value', datafield: 3, cellclassname: callbackStyleSingleGrid, width: '30%' },
                    { text: 'Flag', datafield: 4, cellclassname: callbackStyleSingleGrid, width: '10%' }
                ]
            });


            $("#specialForm").modal({
                backdrop: 'static',
                keyboard: false});

            observer.applyListeners(this, productionController)
            $('#specialForm').on('shown.bs.modal', function (e) {
                $('#productionTabs').jqxTabs();
            })

        }

        ProductionEditor.prototype.updateTotGrid = function (calculatedModel, formulaToApply, isAreaHarv) {
            areaHarvSelected = isAreaHarv

            formulaToRenderTotVal = formulaToApply

            observer.unbindEventsFromTotalValues()

            var source = {
                datatype: "array",
                datafields: [
                    { name: 6, type: 'string' },
                    { name: 7, type: 'string'},
                    { name: 3, type: 'float' },
                    { name: 4, type: 'string'},
                    {name: 5, type: 'string'}
                ],
                id: 'ppp',
                localdata: calculatedModel
            };

            var dataAdapter = new $.jqx.dataAdapter(source);

            $('#gridTotalValues').jqxGrid({
                source: dataAdapter,
                width: "100%",
                editable: true,
                autorowheight: true,
                selectionmode: 'singlecell',
                columnsresize: true,
                pageable: true,
                autoheight: true,
                columns: [
                    { text: 'Element', datafield: 6, cellclassname: callbackStyleTotGrid, width: '25%' },
                    { text: 'Value', datafield: 3, cellclassname: callbackStyleTotGrid, width: '15%'},
                    { text: 'Flags', datafield: 4, cellclassname: callbackStyleTotGrid, width: '25%',
                        createeditor: callbackMultiFlagCreation, initeditor: callbackMultiFlagInit, geteditorvalue: callbackMultiFlagGetValues, heigth: 250
                    },
                    { text: 'Notes', datafield: 5, cellclassname: callbackStyleTotGrid, width: '35%'}
                ]
            });

            observer.reBindEventsFromTotalValues()
        }

        ProductionEditor.prototype.updateSingleGrid = function (calculatedModel, formulaToApply, isAreaHarv) {
            areaHarvSelected = isAreaHarv

            formulaToRenderSingleCrops = formulaToApply

            var source = {
                datatype: "array",
                datafields: [
                    { name: 6, type: 'string'},
                    { name: 7, type: 'string'},
                    { name: 3, type: 'float' },
                    { name: 4, type: 'string'},
                    { name: 5, type: 'string'}
                ],
                id: 'ppp',
                localdata: calculatedModel
            };

            var dataAdapter = new $.jqx.dataAdapter(source);

            $('#gridSingleCrops').jqxGrid({
                autorowheight: true,
                source: dataAdapter,
                width: "100%",
                editable: true,
                selectionmode: 'singlecell',
                columnsresize: true,
                pageable: true,
                autoheight: true,
                columns: [
                    { text: 'Element', datafield: 6, cellclassname: callbackStyleSingleGrid, width: '40%' },
                    { text: 'Crop', datafield: 7, cellclassname: callbackStyleSingleGrid, width: '20%' },
                    { text: 'Value', datafield: 3, cellclassname: callbackStyleSingleGrid, width: '30%' },
                    { text: 'Flag', datafield: 4, cellclassname: callbackStyleSingleGrid, width: '10%' }
                ]
            });

        }

        ProductionEditor.prototype.saveDataTotGrid = function (dataCalculated, originalData) {
            console.log(dataCalculated)
            console.log(originalData)
            controllerEditors.saveFormProduction(dataCalculated, originalData);
        }

        ProductionEditor.prototype.setTotalValuesOnModified = function () {
            observer.setTotalValuesModified();
        }

        ProductionEditor.prototype.destroyAll = function () {
            $('#gridTotalValues').jqxGrid('destroy')
            $('#gridSingleCrops').jqxGrid('destroy');

            $('#firstCheckBoxTotVal').jqxCheckBox('destroy');
            $('#secondCheckBoxTotVal').jqxCheckBox('destroy');
            $('#thirdCheckBoxTotVal').jqxCheckBox('destroy');

            $('#firstCheckBoxSingleCrops').jqxCheckBox('destroy');
            $('#secondCheckBoxSingleCrops').jqxCheckBox('destroy');
            $('#thirdCheckBoxSingleCrops').jqxCheckBox('destroy');

            $('#productionTabs').jqxTabs('destroy');
        }

        ProductionEditor.prototype.changeLabelToArea = function (isAreaHarvested, isTotalValue) {

            var idLabel = (isTotalValue) ? "secondCheckBoxTotValLabel" : "secondCheckBoxSingCropsLabel";

            areaHarvSelected = isAreaHarvested

            var areaLabel = (isAreaHarvested) ? "Area Harvested" : "Area Planted";
            $("#" + idLabel).html(areaLabel)
        }

        ProductionEditor.prototype.createStyleClassGridTotal = function (row, column, value, data) {

            var result;
            var conditionDisable = ((row === 0 && !areaHarvSelected) || ((row == 3 && areaHarvSelected)) ||
                ((row === 0 + (4 * 1) && !areaHarvSelected) || ((row == 3 + (4 * 1) && areaHarvSelected))) ||
                ((row === 0 + (4 * 2) && !areaHarvSelected) || ((row == 3 + (4 * 2) && areaHarvSelected))));


            switch (formulaToRenderTotVal) {
                case 'init':
                case 'yield':
                    var conditionCalculated = ((row == 1) || row == 1 + (4 * 1) || row == 1 + (4 * 2))
                    if (conditionCalculated) {
                        result = 'calculatedRowGrid'
                    } // area harvested disabled
                    else if (conditionDisable) {
                        result = 'areaDisabled';
                    }
                    else {
                        result = 'notCalculatedRows'
                    }
                    break;
                case 'areaHarvested':
                    var conditionCalculated = ((row == 0 && areaHarvSelected) || (row == 3 && !areaHarvSelected) ||
                        (row == 0 + 4 * 1 && areaHarvSelected) || (row == 3 + 4 * 1 && !areaHarvSelected) ||
                        (row == 0 + 4 * 2 && areaHarvSelected) || (row == 3 + 4 * 2 && !areaHarvSelected))

                    if (conditionCalculated) {
                        result = 'calculatedRowGrid'
                    }
                    else if (conditionDisable) {
                        result = 'areaDisabled';
                    } else {
                        result = 'notCalculatedRows'
                    }
                    break;

                case 'production':
                    var conditionCalculated = (row == 2 || row == 2 + 4 * 1 || row == 2 + 4 * 1)

                    if (conditionCalculated) {
                        result = 'calculatedRowGrid';
                    }
                    else if (conditionDisable) {
                        result = 'areaDisabled';
                    }
                    else {
                        result = 'notCalculatedRows'
                    }

                    break;
            }
            return result;
        }

        ProductionEditor.prototype.createStyleClassGridSingle = function (row, column, value, data) {

            var result;
            var conditionDisable = ((row === 0 && !areaHarvSelected) || ((row == 3 && areaHarvSelected)) ||
                ((row === 0 + (4 * 1) && !areaHarvSelected) || ((row == 3 + (4 * 1) && areaHarvSelected))) ||
                ((row === 0 + (4 * 2) && !areaHarvSelected) || ((row == 3 + (4 * 2) && areaHarvSelected))));


            switch (formulaToRenderSingleCrops) {
                case 'init':
                case 'yield':
                    var conditionCalculated = ((row == 1) || row == 1 + (4 * 1) || row == 1 + (4 * 2) || row == 1 + (4 * 3) )
                    if (conditionCalculated) {
                        result = 'calculatedRowGrid'
                    } // area harvested disabled
                    else if (conditionDisable) {
                        result = 'areaDisabled';
                    }
                    else {
                        result = 'notCalculatedRows'
                    }
                    break;
                case 'areaHarvested':
                    var conditionCalculated = ((row == 0 && areaHarvSelected) || (row == 3 && !areaHarvSelected) ||
                        (row == 0 + 4 * 1 && areaHarvSelected) || (row == 3 + 4 * 1 && !areaHarvSelected) ||
                        (row == 0 + 4 * 2 && areaHarvSelected) || (row == 3 + 4 * 2 && !areaHarvSelected))

                    if (conditionCalculated) {
                        result = 'calculatedRowGrid'
                    }
                    else if (conditionDisable) {
                        result = 'areaDisabled';
                    } else {
                        result = 'notCalculatedRows'
                    }
                    break;

                case 'production':
                    var conditionCalculated = (row == 2 || row == 2 + 4 * 1 || row == 2 + 4 * 1)

                    if (conditionCalculated) {
                        result = 'calculatedRowGrid';
                    }
                    else if (conditionDisable) {
                        result = 'areaDisabled';
                    }
                    else {
                        result = 'notCalculatedRows'
                    }

                    break;
            }
            return result;

        }

        ProductionEditor.prototype.createMultiFlagEditor = function (row, cellValue, editor, cellText, width, height) {
            var stringValue = cellValue;
            var oldInput = document.getElementById(editor[0].id)
            oldInput.parentNode.className = oldInput.parentNode.className + " flagClass"
            var newInput = document.createElement('div')
            newInput.id = oldInput.id;
            newInput.className = oldInput.className;
            oldInput.parentNode.replaceChild(newInput, oldInput)
            var stringToAppend = '<select multiple tabindex="-1" id="multiFlag" style="width:100%" class="input-group-lg">';
            stringToAppend += flagController.getOptions(stringValue)
            stringToAppend += '</select>'
            $('#' + editor[0].id).append(stringToAppend)
        }

        ProductionEditor.prototype.createMultiFlagInit = function (row, cellValue, editor, cellText, width, height) {
            $('#multiFlag').select2({placeholder: "Click to select the flags"});
        }

        ProductionEditor.prototype.getFromMultiFlag = function (row, cellValue, editor) {
            var codes = $('#multiFlag').select2("val");
            return  flagController.getStringFromCodes(codes);
        }

        ProductionEditor.prototype.showAlertTotal = function () {

            if (!document.getElementById('alertTotal').firstChild) {
                $("#alertTotal").append(alertSelection)
            }
        }

        ProductionEditor.prototype.showAlertSingle = function () {
            if (!document.getElementById('alertSingle').firstChild) {
                $("#alertSingle").append(alertSelection)
            }
        }

        ProductionEditor.prototype.cancelAlerts = function (isTotal) {
            var myNode = (isTotal) ? document.getElementById('alertTotal') : document.getElementById('alertSingle');
            while (myNode.firstChild) {
                myNode.removeChild(myNode.firstChild);
            }

        }


        return ProductionEditor;
    })