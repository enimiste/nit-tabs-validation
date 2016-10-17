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
 *    var identification = $('.inform_cn_validation').parsley();
 *    var info_demandeur = $('.info_demand_validation').parsley();
 *    var rules = {
 *               1: [identification],//array of parsley instances
 *               2: [info_demandeur]
 *           };
 *
 *    var nit = new NickelITValidation('.nit-validation-elem', [1, 2, 3], '.nav.nav-tabs a[data-tab-id]', rules);
 *    nit.setCanDisableInactiveTabs(false);//set if the library should disable the inactive tabs or not
 *    nit.setActiveTab(1);//set the initial actived tab
 *    nit.setNextBtnSelector('.btnNext');//to handle the click on the next button
 *    nit.setPrevBtnSelector('.btnPrevious');//to handle the click on the prev button
 */
(function (window, _, $, Prasley) {

  /**
   *
   * @param storageSelector string
   * @param tabIds Array of ints
   * @param tabNavSelector string returns list of <a> with data-tab-id attribute
   * @param parsleyRules Object (Keys as tab id, value as parsley instance(s))
   * @returns {NickelITValidation}
   * @constructor
   */
  window.NickelITValidation = function (storageSelector, tabIds, tabNavSelector, parsleyRules) {

    this.canDisableInactiveTabs = true;
    this.foncusOnInputOnFailer = true;
    /**
     * @param val boolean
     */
    function setCanDisableInactiveTabs (val) {
      canDisableInactiveTabs = val;
    }

    /**
     * @param val boolean
     */
    function setFoncusOnInputOnFailer (val) {
      foncusOnInputOnFailer = val;
    }

    /**
     *
     * @param selector string
     * @param onclick function callback to call when next btn clicked and validation passed
     */
    function setNextBtnSelector (selector, onclick) {
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
    function setPrevBtnSelector (selector, onclick) {
      $(selector).each(function () {
        $(this).click(function (event) {
          moveToPrevTab();
          if (_.isFunction(onclick)) onclick(event);
        })
      });
    }

    /**
     * Returns true if all input within this instances list are valid
     *
     * @returns boolean
     * @param instance
     */
    function isAllValid (instance) {
      return _.reduce(instance, function (acc, p) {
        if (_.has(p, '__class__')) {
          p.validate();
          return acc && p.isValid();
        }
        else return true;
      }, true);
    }

    /**
     * @returns boolaan
     */
    function canMoveNext () {
      if (!_.isPlainObject(parsleyRules)) return true;
      else {
        var active = activeTab();
        if (!_.has(parsleyRules, active)) {
          return true;
        }
        else {
          var rule = _.propertyOf(parsleyRules)(active);
          if (!_.isArray(rule))
            rule = [rule];
          return _.reduce(rule, function (acc, r) {
            return acc && isAllValid(r);
          }, true);
        }
      }
    }

    /**
     * @param val
     */
    function setActiveTab (val) {
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
    function moveToNextTab () {
      var tab = $(storageSelector).data('active-tab');
      setActiveTab(tab + 1);
    }

    /**
     * Updates values on btns
     *
     */
    function moveToPrevTab () {
      var tab = $(storageSelector).data('active-tab');
      setActiveTab(tab - 1);
    }

    /**
     * @return int tabIds id
     */
    function activeTab () {
      return $(storageSelector).data('active-tab');
    }

    /**
     *
     */
    function disableInactiveTabs () {
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
    function preventTabClick (event) {
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
    this.setFoncusOnInputOnFailer = setFoncusOnInputOnFailer;

    if (this.foncusOnInputOnFailer == true) {
      Prasley.on('field:error', function () {
        //TODO : set the focus on the input that has been failed
      });
    }

    return this;
  }

})(window, _, $, window.Parsley);