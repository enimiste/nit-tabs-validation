/**
 * Created by elbachirnouni on 15/10/2016.
 *
 * Depends on lodash.js 1.8.3, parsleyjs 2.5.0 and jQuery v2.1.4
 *
 *
 * HOW TO USE IT :
 * ---------------
 * 1. ADD "data-tab-id" ATTRIBUTE IN EACH <a> OF YOUR .nav-tabs div. Give each one a integer id, ex : 1
 * 2. ADD "nit-validation-elem" class to your tabs parent <div>.
 * 3. ADD TO SAME div BELOW these TOW ATTRIBUTES "data-active-tab"="1" "data-prev-tab"=""
 * 4. YOUR NEXT BTN AND PREV SHOULD HAVE THE SAME CLASS. Ex : btnNext and btnPrevious
 * 5. IF YOU WANT TO USE IT WITH PARSLEY YOUR SHOULD DEFINE A VALIDATION CLASS BY TAB PAGE. EX : info_paiement
 *      SO YOU CAN CREATE PARSLEY INSTANCE BY TAB PAGE.
 * 6. CREATE A JS OBJECT WITH KEYS AS TABS ID AND VALUES AN ARRAY WITH THE CREATED PARSLEY INSTANCES.
 * 7. NEXT AFTER THE LINE THAT IMPORT JS LIBRARIES YOU INSTANCIATE THIS LIBRARY AND CONFIGURE IT. EX :
 *           var identification = NickelITParsleyValidator('.nit-validation.ident_entr, .nit-validation.inform_cn');
 *           var info_demandeur = NickelITParsleyValidator('.nit-validation.info_demand');
 *
 *           var customValidator = function () {
 *               this.init = function () {
 *                   //This function is executed once at registration
 *               };
 *
 *               this.validate = function () {
 *               };
 *
 *               this.isValid = function () {
 *                   return true;
 *               };
 *
 *               return this;
 *           };
 *           var rules = new NickelITParsleyRules();
 *           rules.add(1, rules.new(identification));
 *           rules.add(2, rules.new(info_demandeur));
 *           rules.add(2, rules.new(new customValidator()));
 *
 *           var nit = new NickelITValidation('.nit-validation-elem', [1, 2, 3], '.nav.nav-tabs a[data-tab-id]', rules);
 *           nit.setCanDisableInactiveTabs(true);
 *           nit.setActiveTab(1);
 *           nit.setNextBtnSelector('.btnNext');
 *           nit.setPrevBtnSelector('.btnPrevious');
 */
(function (window, _, $, Prasley) {

    /**
     *
     * @param storageSelector string
     * @param tabIds Array of ints
     * @param tabNavSelector string returns list of <a> with data-tab-id attribute
     * @param validatorRules NickelITParsleyRules (Keys as tab id, value as parsley instance(s))
     * @returns {NickelITValidation}
     * @constructor
     */
    window.NickelITValidation = function (storageSelector, tabIds, tabNavSelector, validatorRules) {
        this.__nit__class__ = 'NickelITValidation';

        if (validatorRules !== undefined && (!_.has(validatorRules, '__nit__class__') || validatorRules.__nit__class__ !== 'NickelITParsleyRules')) {
            throw 'validatorRules should be of type NickelITParsleyRules';
        }

        this.canDisableInactiveTabs = true;
        this.foncusOnInputOnFailer = true;
        /**
         * @param val boolean
         */
        function setCanDisableInactiveTabs(val) {
            canDisableInactiveTabs = val;
        }

        /**
         * @param val boolean
         */
        function setFocusOnInputOnFailure(val) {
            foncusOnInputOnFailer = val;
        }

        /**
         *
         * @param selector string
         * @param onclick function callback to call when next btn clicked and validation passed
         */
        function setNextBtnSelector(selector, onclick) {
            $(selector).each(function () {
                $(this).click(function (event) {
                    //Check if our input are valid
                    if (canMoveNext()) {
                        moveToNextTab();
                        if (_.isFunction(onclick)) onclick(event);
                    }
                });
            });
        }

        /**
         *
         * @param selector string
         * @param onclick function callback to call when prev btn clicked and validation passed
         */
        function setPrevBtnSelector(selector, onclick) {
            $(selector).each(function () {
                $(this).click(function (event) {
                    moveToPrevTab();
                    if (_.isFunction(onclick)) onclick(event);
                })
            });
        }

        /**
         * @returns boolaan
         */
        function canMoveNext() {
            if (validatorRules === undefined) return true;
            else {
                var active = activeTab();
                var rule = validatorRules.getRuleByTabId(active);
                if (rule === undefined) {
                    console.log('Rule not found for tabId ' + active);
                    return true;
                }
                else return rule.isValid();
            }
        }

        /**
         * @param val
         */
        function setActiveTab(val) {
            var elem = $(storageSelector);
            elem.data('active-tab', val);
            var min = _.min(tabIds);
            if (val > min)
                elem.data('prev-tab', (val - 1));
            else
                elem.data('prev-tab', '');
            disableInactiveTabs();
        }

        /**
         * Updates values on btns
         *
         */
        function moveToNextTab() {
            var tab = $(storageSelector).data('active-tab');
            setActiveTab(tab + 1);
        }

        /**
         * Updates values on btns
         *
         */
        function moveToPrevTab() {
            var tab = $(storageSelector).data('active-tab');
            setActiveTab(tab - 1);
        }

        /**
         * @return int tabIds id
         */
        function activeTab() {
            return $(storageSelector).data('active-tab');
        }

        /**
         *
         */
        function disableInactiveTabs() {
            if (canDisableInactiveTabs == true) {
                var tabs_link = $(tabNavSelector);
                var active = activeTab();
                tabs_link.each(function () {
                    var elem = $(this);
                    if (elem.data('tab-id') != active) {
                        elem.css("cursor", "not-allowed");
                        elem.on('click', preventTabClick);
                    } else {
                        elem.css("cursor", "default");
                        elem.off('click', preventTabClick);
                        elem.trigger('click');
                    }
                });
            }
        }

        /**
         *
         * @param event
         * @returns {boolean}
         */
        function preventTabClick(event) {
            event.preventDefault();
            return false;
        }

        this.activeTab = activeTab;
        this.moveToPrevTab = moveToPrevTab;
        this.moveToNextTab = moveToNextTab;
        this.setActiveTab = setActiveTab;
        this.canMoveNext = canMoveNext;
        this.disableInactiveTabs = disableInactiveTabs;
        this.setNextBtnSelector = setNextBtnSelector;
        this.setPrevBtnSelector = setPrevBtnSelector;
        this.setCanDisableInactiveTabs = setCanDisableInactiveTabs;
        this.setFocusOnInputOnFailure = setFocusOnInputOnFailure;

        if (this.foncusOnInputOnFailer == true) {
            Prasley.on('field:error', function () {
                //TODO : set the focus on the input that has been failed
            });
        }

        return this;
    };

    window.NickelITParsleyRules = function () {

        this.__nit__class__ = 'NickelITParsleyRules';
        this.rules = {};

        /**
         *
         * @param rule
         * @throws TypeError exception
         */
        this.checkRule = function checkRule(rule) {
            if (!this.isRule(rule))
                throw 'rule should be a valid rule';
        };

        /**
         *
         * @param rules
         * @throws TypeError exception
         */
        this.checkRules = function (rules) {
            if (!_.isArray(rules))
                throw 'rules param should be an array of Rules';

            for (var i = 0; i < rules.length; i++) {
                this.checkRule(rules[i]);
            }
        };

        this.add = function (tabId, rule) {
            this.checkRule(rule);
            if (!_.has(this.rules, tabId)) _.set(this.rules, tabId, rule);
        };

        /**
         *
         * @param validatorInstance Parsley Instance
         */
        this.new = function (validatorInstance) {
            if (!hasFunctions(validatorInstance, ['init', 'validate', 'isValid']))
                throw 'The validator instance should implement these functions : init():void, validate():void, isValid():boolean';

            return new NickelITParsleySimpleRule(validatorInstance);
        };

        /**
         *
         * @param rules Array of {Window.NickelITParsleySimpleRule}
         */
        this.or = function (rules) {
            if (arguments.length > 1)
                this.rules = Array.prototype.slice.call(arguments);
            else
                this.rules = rules;

            this.checkRules(rules);
            return new NickelITParsleyOrRule(rules);
        };

        /**
         *
         * @param rules Array of {Window.NickelITParsleySimpleRule}
         */
        this.and = function (rules) {
            if (arguments.length > 1)
                this.rules = Array.prototype.slice.call(arguments);
            else
                this.rules = rules;

            this.checkRules(rules);
            return new NickelITParsleyAndRule(rules);
        };

        /**
         *
         * @param discriminatorSelector string
         * @param matcher {Window.NickelITParsleyConditionalRuleMatcher}
         */
        this.conditional = function (discriminatorSelector, matcher) {
            return new NickelITParsleyConditionalRule(discriminatorSelector, matcher);
        };

        /**
         *
         * @returns {Window.NickelITParsleyConditionalRuleMatcher}
         */
        this.newMatcher = function () {
            return new NickelITParsleyConditionalRuleMatcher(this);
        };

        /**
         *
         * @param rule
         */
        this.isRule = function (rule) {
            return rule !== undefined
                && _.has(rule, '__nit__class__')
                && (
                    rule.__nit__class__ === 'NickelITParsleySimpleRule'
                    || rule.__nit__class__ === 'NickelITParsleyAndRule'
                    || rule.__nit__class__ === 'NickelITParsleyOrRule'
                    || rule.__nit__class__ === 'NickelITParsleyConditionalRule'
                );
        };

        this.getRuleByTabId = function (tabId) {
            if (_.has(this.rules, tabId)) return _.propertyOf(this.rules)(tabId);
            else return undefined;
        };

        return this;
    };

    window.NickelITParsleySimpleRule = function (validatorInstance) {
        this.validatorInstance = validatorInstance;
        this.__nit__class__ = 'NickelITParsleySimpleRule';

        if (!hasFunctions(validatorInstance, ['init', 'validate', 'isValid']))
            throw 'The validator instance should implement these functions : init():void, validate():void, isValid():boolean';

        validatorInstance.init();

        this.isValid = function () {
            this.validatorInstance.validate();
            return this.validatorInstance.isValid();
        };

        return this;
    };

    window.NickelITParsleyAndRule = function (rules) {
        this.rules = rules;
        this.__nit__class__ = 'NickelITParsleyAndRule';

        this.isValid = function () {
            return _.reduce(this.rules, function (acc, r) {
                return acc && r.isValid();
            }, true);
        };

        return this;
    };

    window.NickelITParsleyOrRule = function (rules) {
        this.rules = rules;
        this.__nit__class__ = 'NickelITParsleyOrRule';

        this.isValid = function () {
            for (var i = 0; i < this.rules.length; i++) {
                if (this.rules[i].isValid()) return true;
            }
        }
    };

    window.NickelITParsleyConditionalRule = function (discriminatorSelector, matcher) {
        this.discriminatorSelector = discriminatorSelector;
        this.matcher = matcher;
        this.__nit__class__ = 'NickelITParsleyConditionalRule';

        this.isValid = function () {
            var elem = $(this.discriminatorSelector);
            if (elem === undefined)
                throw 'Element not found with selector : ' + this.discriminatorSelector;
            var value = elem.val();
            var rule = this.matcher.match(value);
            if (rule !== undefined) return rule.isValid();
            else return true;
        };

        return this;
    };

    window.NickelITParsleyConditionalRuleMatcher = function (nickelITParsleyRules) {
        this.matching = {};
        this.nickelITParsleyRules = nickelITParsleyRules;
        this.__nit__class__ = 'NickelITParsleyConditionalRule';

        /**
         *
         * @param val string
         * @param rule
         */
        this.whenValue = function (val, rule) {
            this.nickelITParsleyRules.checkRule(rule);
            if (!_.has(this.matching, val)) _.set(this.matching, val, rule);

            return this;
        };

        /**
         *
         * @param val string
         */
        this.match = function (val) {
            if (_.has(this.matching, val)) return _.propertyOf(this.matching)(val);
            else return undefined;
        };

        return this;
    };

    window.NickelITParsleyValidator = function (selector) {
        this.instances = [];
        this.selector = selector;

        this.init = function () {
            //This function is executed once at registration
            this.instances = $(this.selector).parsley();
            if (!_.isArray(this.instances)) this.instances = [this.instances];
        };

        this.validate = function () {
            this.init();
            _.each(this.instances, function (i) {
                i.validate();
            });
        };

        this.isValid = function () {
            return _.reduce(this.instances, function (acc, i) {
                return acc && i.isValid();
            }, true);
        };

        return this;
    };

    window.hasFunctions = function (obj, fns) {
        return _.intersection(_.functions(obj), fns).length === fns.length;
    }

})(window, _, $, window.Parsley);