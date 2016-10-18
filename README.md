# Tabs workflow management and validation
This package can be used with Twitter Bootstrap to manage the workflow between tabs.
Old : Can be used also to check Parsley validation before move from a tab to another.

Now : The library is Parsley agnostic. The validator should implements three functions : `refresh():void`, `validate():void` and `isValid():Boolean`
## Installation :
```sh
 bower install --save nit-tabs-validation
```   

```html
 <script src="path/to/jquery.js"></script>
 <script src="path/to/parsley.js"></script>
 <script src="path/to/nit-tabs-validation/index.js"></script>

```
## Usage :

1. ADD "data-tab-id" ATTRIBUTE IN EACH <a> OF YOUR .nav-tabs div. Give each one a integer id, ex : 1
2. ADD "nit-validation-elem" class to your tabs parent <div>.
3. ADD TO SAME div BELOW these TOW ATTRIBUTES "data-active-tab"="1" "data-prev-tab"=""
4. YOUR NEXT BTN AND PREV SHOULD HAVE THE SAME CLASS. Ex : btnNext and btnPrevious
5. IF YOU WANT TO USE IT WITH PARSLEY YOUR SHOULD DEFINE A VALIDATION CLASS BY TAB PAGEEX : info_paiement
     SO YOU CAN CREATE PARSLEY INSTANCE BY TAB PAGE.
6. CREATE A JS OBJECT WITH KEYS AS TABS ID AND VALUES AN ARRAY WITH THE CREATED PARSLEINSTANCES.
7. NEXT AFTER THE LINE THAT IMPORT JS LIBRARIES YOU INSTANCIATE THIS LIBRARY AND CONFIGURE IT. EX :

```js
    var identification = new NickelITParsleyValidator('.nit-validation.ident_entr, .nit-validation.inform_cn');
    var info_demandeur = new NickelITParsleyValidator('.nit-validation.info_demand');

    //To create your own validator
    var customValidator = function () {
        this.refresh = function () {
        };
        this.validate = function () {
        };
        this.isValid = function () {
            return true;
        };
        return this;
    };
    var rules = new NickelITParsleyRules();
    rules.add(1, rules.new(identification));
    rules.add(2, rules.new(info_demandeur));
    rules.add(3, rules.new(new customValidator()));
    /*
     1 : identification
     2 : informations demandeur
     3 : récapitulatif
     */
    var nit = new NickelITValidation('.nit-validation-elem', [1, 2, 3], '.nav.nav-tabs a[data-tab-id]', rules);
    nit.setCanDisableInactiveTabs(true);
    nit.setActiveTab(1);
    nit.setNextBtnSelector('.btnNext');
    nit.setPrevBtnSelector('.btnPrevious');
```

## License 
MIT

