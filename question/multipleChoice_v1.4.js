
var MULTIPLE_CHOICE_TYPE = "MultipleChoice";
var TE_RENDER_FINISHED = "TE_RENDER_FINISHED";
function multipleChoiceTE() {
    /// struct of html using
    var multipleChoiceJSONData = {
        'cid' : "802055_cr_ch02_q55_ans01",
        'ctype' : "MultipleChoice",
        'qname' : "a1",
        'subtype' : "MC" || "MSC",
        'layout' : "Vertical" || "Horizontal" || "Table-2-Column" || "Table-3-Column" || "Table-4-Column" || "Table-5-Column",
        'verticalOptions' : "" || "middle",
        'optionsArray' : [
            {'itemid': "a", 'itemlabel' : "", 'content' : "HTML INSIDE "},
            {'itemid': "b", 'itemlabel' : "", 'content' : "HTML INSIDE "},
            {'itemid': "c", 'itemlabel' : "", 'content' : "HTML INSIDE "},
            {'itemid': "d", 'itemlabel' : "", 'content' : "HTML INSIDE "}]
    };

    var me = this;

    this.initComponent = function () {
        if ($('div[ctype="' + MULTIPLE_CHOICE_TYPE + '"]').length > 0) {
            $('div[ctype="' + MULTIPLE_CHOICE_TYPE + '"]').each(function (index, component) {
                $(component).addClass('multipleChoiceComponent');
                if ($(component).attr('layout')) {
                    $(component).addClass($(component).attr('layout'));
                }
                me.component_init(component);
            });
        }
    };

    this.initComponentForContainer = function (container) {
        if ($(container).find('div[cType="' + MULTIPLE_CHOICE_TYPE + '"]').length > 0) {
            $(container).find('div[cType="' + MULTIPLE_CHOICE_TYPE + '"]').each(function (index, component) {
                $(component).addClass('multipleChoiceComponent');
                if ($(component).attr('layout')) {
                    $(component).addClass($(component).attr('layout'));
                }
                me.component_init(component);
            });
        }
    };

    this.showCorrectAnswer = function (componentType, questionNumber, componentId, answer) {
        var $component = getComponentByData(componentType, questionNumber, componentId);
        if($component != null && $component.length > 0){
            clearAnswerForComponent($component);

            var answerArray = answer.split(",");
            for (var i = 0; i < answerArray.length; i++) {
                var answerPart = answerArray[i];
                if (answerPart != "") {
                    $component.find('span.check-box[value="' + answerPart + '"]').addClass('checked');
                    $component.find('span.check-box[value="' + answerPart + '"]').closest('.multiple-choice-item').addClass("selected");
                }
            }
        }
    };

    this.getStudentResponse = function (questionNumber) {
        var studentResponseArray = [];

        if ($('div[ctype="' + MULTIPLE_CHOICE_TYPE + '"][qname="' + questionNumber + '"]').length > 0) {
            $('div[ctype="' + MULTIPLE_CHOICE_TYPE + '"][qname="' + questionNumber + '"]').each(function (index, component) {
                var responses = getStudentResponseForMultipleChoice(component);
                if (responses != null) {
                    studentResponseArray.push(responses);
                }
            });
        }

        return studentResponseArray;

        function getStudentResponseForMultipleChoice(component) {
            var componentId = $(component).attr("cid");
            var multipleChoiceResponse = getMultipleChoiceResponse($(component));
            return generateAnswerForComponent(componentId, MULTIPLE_CHOICE_TYPE, multipleChoiceResponse);
        }

        function getMultipleChoiceResponse($component) {
            var answerArray = [];

            $component.find('.multiple-choice-item').find('.multiple-choice-checkbox').find('.check-box.checked').each(function(){
                answerArray.push($(this).attr("value"));
            });

            return answerArray.join(',');
        }
    };


    this.clearAnswer = function () {
        $('div[ctype="' + MULTIPLE_CHOICE_TYPE + '"]').each(function(){
            clearAnswerForComponent($(this));
        });
    };

    this.clearAnswerForQuestion = function (questionContainer) {
        if ($(questionContainer).find('div[ctype="' + MULTIPLE_CHOICE_TYPE + '"]').length > 0) {
            $(questionContainer).find('div[ctype="' + MULTIPLE_CHOICE_TYPE + '"]').each(function(){
                clearAnswerForComponent($(this));
            });
        }
    };

    function clearAnswerForComponent ($component){
        $component.find('.multiple-choice-item').removeClass("selected");
        $component.find('.multiple-choice-item').find('span.check-box.checked').removeClass("checked");
    }


    this.component_init = function (component) {
        if($(component).hasClass(TE_RENDER_FINISHED)){

        } else {
            $(component).addClass(TE_RENDER_FINISHED);
            var config = getConfigForMultipleChoise($(component));

            var pDiv = $('div[pid=' + $(component).attr('cid') + ']');
            if (pDiv.length > 0) {
                config.maxChoice = $(pDiv).attr('mMax');
                config.correctAnswer = $(pDiv).attr('c');
                config.startAt = $(pDiv).attr('startAt');
            }

            me.renderLayoutForMultipleChoice(component, config);
        }

        function getConfigForMultipleChoise($component){
            var cid = $component.attr('cid');
            var subType = $component.attr('subtype');
            var layoutName = $component.attr('layout');
            var listOptions = [];

            $component.find(' > div[itemid]').each(function(){
                listOptions.push({'idx': $(this).attr("itemid"), 'label': $(this).attr("itemlabel"), 'content': $(this).html()});
                $(this).remove();
            });

            return {
                cid: cid,
                subType : subType,
                layoutName : layoutName,
                listOptions:  listOptions
            }
        }
    };

    this.updatePositionForComponent = function(container){
        if(container != null){
            $(container).find('div[cType="' + MULTIPLE_CHOICE_TYPE +'"]').each(function(index, component) {
                updateLabelDisplayForMultipleChoice($(component));
            });
        } else {
            $('div[cType="' + MULTIPLE_CHOICE_TYPE +'"]').each(function(index, component) {
                updateLabelDisplayForMultipleChoice($(component));
            });
        }

        function updateLabelDisplayForMultipleChoice($component){
            // multiple-choice-fraction multiple-choice-mixed multiple-choice-sub
            $component.find('.multiple-choice-content').each(function() {
                if ($(this).find(".multiple-choice-fraction").length > 0) {
                    calculateLineHeightForComponent($(this).find(".multiple-choice-fraction"));
                } else if ($(this).find(".multiple-choice-mixed").length > 0) {
                    calculateLineHeightForComponent($(this).find(".multiple-choice-mixed"));
                } else if ($(this).find(".multiple-choice-sub").length > 0){
                    calculateLineHeightForComponent($(this).find(".multiple-choice-sub"));
                } else if ($(this).find(".multiple-choice-mathjax-inline").length > 0){
                    calculateLineHeightForComponent($(this).find(".multiple-choice-mathjax-inline"));
                }
            });

            function calculateLineHeightForComponent ($content){
                var mathJax = $content.find(".MathJax").find(" > .math");

                if(mathJax == null || mathJax.length == 0){
                    mathJax = $content.find(".MathJax_Preview > .MJXp-math");
                }

                if(mathJax != null && mathJax.height() > 0){
                    $content.css("line-height", mathJax.height() + "px");
                    var $mcItem  = $content.closest(".multiple-choice-item");
                    $mcItem.addClass("custom-math-jax");

                    $mcItem.find(".multiple-choice-checkbox").find(".checkbox-ctn" ).css({"height": mathJax.height(), "line-height": mathJax.height() + "px"});
                    $mcItem.find(".multiple-choice-label"   ).find(".label-display").css({"height": mathJax.height(), "line-height": mathJax.height() + "px"});
                }
            }
        }
    };

    this.renderLayoutForMultipleChoice = function(component, config){
        $(component).find('.multiple-choice-table').remove();

        var numberColumn = config.listOptions.length;
        if(config.layoutName == 'Table-2-Columns' || config.layoutName == 'Table-3-Columns' || config.layoutName == 'Table-4-Columns' || config.layoutName == 'Table-5-Columns') {
            numberColumn = parseInt(config.layoutName.split('-')[1]);
        } else if (config.layoutName == "Vertical"){
            numberColumn = 1;
        }

        var tableHTML = [];
        tableHTML.push('<table class="multiple-choice-table" cellpadding="0" cellspacing="0" style="width: 100%">');
        tableHTML.push('<tbody>');

        var numberRow = config.listOptions.length % numberColumn == 0 ? config.listOptions.length / numberColumn :  config.listOptions.length - (config.listOptions.length % numberColumn) + 1;

        var index = 0;
        var displayIndex = 0;
        var skippedOption = getSkippingOptions(config, numberRow);
        for(var i = 0; i < numberRow; i++){
            if (skippedOption.indexOf(i) != -1) {
                index++;
                continue;

            }
            tableHTML.push('<tr>');
            for(var j = 0; j < numberColumn; j++){
                var optionData = index < config.listOptions.length &&  config.listOptions[index] != null ? config.listOptions[index] : null;
                tableHTML.push('<td class="multiple-choice-item" style="width: ' + (100 / numberColumn)  +'%">');
                tableHTML.push(    '<table class="multiple-choice-item-table" cellpadding="0" cellspacing="0" style="width: 100%"><tr>');
                tableHTML.push(        '<td class="multiple-choice-checkbox"><span class="checkbox-ctn">' + (optionData != null ? getCheckBoxByType(config.cid, optionData.idx, config.subType) : '') + '&nbsp;</span></td>');
                tableHTML.push(        '<td class="multiple-choice-label">'    + (optionData != null ? '<span class="label-display">' + String.fromCharCode(97 + displayIndex) + '.</span>' : '') + '</td>');
                tableHTML.push(        '<td class="multiple-choice-content" style="width: 100%">'  + (optionData != null ? optionData.content : '') + '</td>');
                tableHTML.push(    '</tr></table>');
                tableHTML.push('</td>');
                index++;
                displayIndex ++;
            }
            tableHTML.push('</tr>');
            if(i < numberRow - 1){
                tableHTML.push('<tr class="multiple-choice-separate-line">');
                tableHTML.push('<td colspan="' + numberColumn +'"></td>');
                tableHTML.push('</tr>');
            }
        }

        tableHTML.push('</tbody>');
        tableHTML.push('</table>');

        $(component).append($(tableHTML.join("")));

        $(component).find('.multiple-choice-checkbox .checkbox-ctn span.check-box ').click(function(){
            if($(this).attr("type") == "checkbox"){
                $(this).toggleClass("checked");
            } else {
                if (! $(this).hasClass("checked")){
                    $(this).closest('.multiple-choice-table').find('.multiple-choice-checkbox span.check-box.checked').removeClass("checked");
                    $(this).addClass("checked");
                }
            }
        });

        var totalOption = $(component).find(".multiple-choice-item-table").find('.multiple-choice-content').length;
        $(component).find(".multiple-choice-item-table").find('.multiple-choice-content').each(function(idx, option){
            if($(option).find(' > .math-tex').length == 1 && $(option).children().length == 1){
                if(idx == 0){
                    $(option).closest(".multiple-choice-table").css({
                        "margin-top": "30px"
                    });
                }

                if(idx < totalOption - 1){
                    $(option).css({"padding-bottom": "30px"});
                } else {
                    $(option).css({"padding-bottom": "10px"});
                }
            }
        });



        function getSkippingOptions(config, numberRow) {
            var result = [];
            if (config.maxChoice != null && 'MC' == config.subType) {
                var noSkippedOptions = parseInt(numberRow) - parseInt(config.maxChoice);

                if (noSkippedOptions > 0) {
                    var correctInt = config.correctAnswer.charCodeAt(0) - 97;
                    var theIntVal = parseInt(config.startAt);
                    while(true) {
                        if (correctInt == (theIntVal % numberRow)) {

                        } else {
                            result.push(theIntVal);
                        }
                        theIntVal = theIntVal + 1;
                        if (result.length == noSkippedOptions) {
                            break;
                        }
                    }
                }
            }
            return result;
        }

        function getCheckBoxByType (cid, value, subType){
            if(subType == "MC"){
                return '<span class="check-box" type="radio" name="' + cid + '" value="' + value +'"></span>';
            } else {
                return '<span class="check-box" type="checkbox" name="' + cid + '" value="' + value +'"></span>';
            }
        }
    };




    this.generateFeedbackFromData = function (questionForm, feedbackData) {
        var $component = questionForm.find('[ctype="' + feedbackData.componentType + '"][cid="' + feedbackData.componentId + '"]');
        var correctAnswerArray = feedbackData.componentCorrectAnswer.split(",");
        var mappingFeedbackData = {};

        if(feedbackData.studentAnswer==null){
            //var $checkMarkLabel = feedbackComponent.generateCheckMark(feedbackData.componentId, 0, 0, false);
            //$component.append($checkMarkLabel);

            $component.find('.multiple-choice-checkbox .check-box').each(function (index, item) {
                var isCorrect = false;
                var idx = $(item).attr("value");
                if (correctAnswerArray.indexOf(idx) != -1 ) {
                    var $checkMarkLabel = feedbackComponent.generateCheckMark(feedbackData.componentId, idx, index, isCorrect);
                    $component.find('.multiple-choice-checkbox .check-box[value="' + idx + '"]').closest('.checkbox-ctn').append($checkMarkLabel);
                    $component.find('.multiple-choice-checkbox .check-box[value="' + idx + '"]').closest('.multiple-choice-item-table').find('.audio-component').addClass('corect-answer-audio-icon');
                }
            });
        } else {
            $component.find('.multiple-choice-checkbox .check-box').each(function (index, item) {
                var isCorrect = false;
                var idx = $(item).attr("value");

                if ($(item).hasClass("checked")) {
                    for (var i = 0; i < correctAnswerArray.length; i++) {
                        var correctAnswer = correctAnswerArray[i];

                        if (correctAnswer == idx) {
                            isCorrect = true;
                            correctAnswerArray.splice(i, 1);
                            break;
                        }
                    }
                    mappingFeedbackData[idx] = isCorrect;
                }
            });

            var index = 0;
            for (var idx in mappingFeedbackData) {
                var isCorrect = mappingFeedbackData[idx];
                var $checkMarkLabel = feedbackComponent.generateCheckMark(feedbackData.componentId, idx, index, isCorrect);
                $component.find('.multiple-choice-checkbox .check-box[value="' + idx + '"]').closest('.checkbox-ctn').append($checkMarkLabel);
                $component.find('.multiple-choice-checkbox .check-box[value="' + idx + '"]').closest('.multiple-choice-item-table').find('.audio-component').addClass('corect-answer-audio-icon');
                index++;
            }
        }

    };


    this.displayCheckedMark = function (questionForm, feedbackData) {
        var correctAnswer = feedbackData.componentCorrectAnswer;
        var answerArr = correctAnswer.split(',');

        $(questionForm).find('.multiple-choice-checkbox > .check-box').each(function (index, element) {
            if ($(element).hasClass('checked')) {
                var val = $(element).attr('value');
                if (answerArr.indexOf(val) == -1) {
                    var sp = $('<span class="feedback-check-mark mscNotCorrect"></span>');
                    $(element).parent().append(sp);
                } else {
                    var sp = $('<span class="feedback-check-mark mscCorrect"></span>');
                    $(element).parent().append(sp);
                }
            }
        });
    };

    this.popUpFeedback = function (questionForm, feedbackData) {
        var correctClass = feedbackData.correct ? 'correct' : 'incorrect';
        if (feedbackData.displayingFeedbacks != null) {
            var feedbackDialogContainer = $("<div class='question-feedback-container " + correctClass + " ' componentId='" + feedbackData.componentId + "'></div>");
            var questionFeedback = $('<div class="question-feedback">');
            var feedbackContainer = $('<div class="feedback-container active"></div>');
            var feedbackHeader = $('<div class="feedback-header"></div> ');
            var feedbackController = $('<div class="feedback-controller"></div>');
            var feedbackBody = $('<div class="feedback-body"></div>');
            var feedbackFooter = $('<div class="feedback-footer"></div>');
            var feedbackAction = $('<div class="feedback-actions"></div>');

            feedbackDialogContainer.append(questionFeedback);
            questionFeedback.append(feedbackContainer);
            feedbackContainer.append(feedbackHeader);
            feedbackContainer.append(feedbackController);
            feedbackContainer.append(feedbackBody);
            feedbackContainer.append(feedbackFooter);
            feedbackFooter.append(feedbackAction);

            var currentContentFeedback = feedbackComponent.addFeedbackContent(feedbackBody, feedbackController, feedbackData.displayingFeedbacks, feedbackData.studentAnswer, feedbackData.componentType);

            feedbackHeader.click(function (event) {
                event.stopPropagation();
                $(this).closest('.question-feedback-container').hide();
                $(questionForm).find('[itemid].fbSelected').removeClass('fbSelected');
                if ($(questionForm).closest('.disable_user_input').length > 0) {

                } else {
                    unbindInputFeedbackForMultipleChoice(questionForm);
                }

            });

            $(questionForm).find('.question-dialog').append(feedbackDialogContainer);
            showMSCFeedback(currentContentFeedback);
            bindInputToFeedbackForMultipleChoice(questionForm);
        }


        function bindInputToFeedbackForMultipleChoice(questionForm) {
            $(questionForm).find('span.mscNotCorrect').bind('click', function (event) {
                event.stopPropagation();
                var id = $(this).next().attr('itemId');
                var feedbackContent = $(questionForm).find('.feedbackContent[correctAnswer=' + id + ']');
                var feedbackContainer = $(this).closest('.feedback-container');

                $(questionForm).find('.question-feedback-container').show();
                $(questionForm).find('.question-feedback-container').find('.feedbackContent').hide();
                $(feedbackContent).show();
                showMSCFeedback(feedbackContent);
            });


            $(questionForm).find('span.mscCorrect').bind('click', function (event) {
                event.stopPropagation();
                var id = $(this).next().attr('itemId');
                var feedbackContent = $(questionForm).find('.feedbackContent[correctAnswer=' + id + ']');
                var feedbackContainer = $(this).closest('.feedback-container');

                $(questionForm).find('.question-feedback-container').show();
                $(questionForm).find('.question-feedback-container').find('.feedbackContent').hide();
                $(feedbackContent).show();
                showMSCFeedback(feedbackContent);
            });

        }

        function unbindInputFeedbackForMultipleChoice(questionForm) {
            $(questionForm).find('input').attr('disabled', null);
            $(questionForm).find('div[itemId].multipleChoiceItem').each(function (index, el) {
                $(el).unbind('click');
            });
        }

        function showMSCFeedback(el) {
            var questionForm = $(el).closest('form');
            var componentId = (el).closest('.question-feedback-container').attr('componentId');
            var componentElement = questionForm.find('div[cid=' + componentId + ']');
            componentElement.find('div[itemId].fbSelected').removeClass('fbSelected');
            componentElement.find('div[itemId=' + $(el).attr('correctanswer') + ']').addClass('fbSelected');
            if ($(el).hasClass('isCorrect')) {
                $(el).closest('.question-feedback-container').removeClass('incorrect').addClass('correct');
            } else {
                $(el).closest('.question-feedback-container').removeClass('correct').addClass('incorrect');
            }
            $(el).closest('.question-feedback-container').css('top',
                (componentElement.offset().top - $(questionForm).find('.question-dialog').offset().top) + componentElement.find('div[itemId=' + $(el).attr('correctanswer') + ']').position().top);

            var feedbackController = $(el).closest('.question-feedback-container').find('.feedback-controller');
            var lastLink = feedbackController.find('.button-previous');
            var nextLink = feedbackController.find('.button-next');

            lastLink.removeClass('active').removeClass('inactive');
            nextLink.removeClass('active').removeClass('inactive');

            if (el.prev().length == 0) {
                lastLink.removeClass('active');
                lastLink.addClass('inactive');
            } else if (el.next().length == 0) {
                nextLink.removeClass('active');
                nextLink.addClass('inactive');
            } else {
                lastLink.addClass('active');
                nextLink.addClass('active');
            }

        }
    };


    function generalRender(item, spanClass) {
        if ($(item).attr('itemLabel') && $(item).attr('itemLabel') != '') {
            $(item).prepend('<span class="multipleChoiceItemLabel ">' + $(item).attr('itemLabel') + '</span>')
        }
        $(item).addClass('multipleChoiceItem');
        var itemHtml = $(item).html();
        $(item).html('<label >' + '<span class="' + spanClass + '">' + $(item).attr('itemId') + '.' + '</span>' + itemHtml + '</label>');
    }

    function multipleSelectChoiceRender(component) {
        var componentID = $(component).attr('cid');
        $(component).find('div[itemId]').each(function (index, item) {
            var inputID = componentID + '_' + $(item).attr('itemId');
            // $(item).addClass('clearfix');
            generalRender(item, 'checkbox_label');
            $(item).prepend($('<input class="checkbox" type="checkbox" id="' + inputID + '">'));

        });
    }


    function multipleChoiceRender(component) {
        var componentID = $(component).attr('cid');
        $(component).find('div[itemId]').each(function (index, item) {
            var inputID = componentID + '_' + $(item).attr('itemId');
            // $(item).addClass('clearfix');
            generalRender(item, 'radio_label');
            $(item).prepend($('<input class="radio" type="radio" id="' + inputID + '" name="' + componentID + '">'));

        });
    }

}

var multipleChoiceTE = new multipleChoiceTE();

function getMultipleChoiceTE() {
    return multipleChoiceTE;
}