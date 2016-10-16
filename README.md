# Tabs workflow management and validation
This package can be used with Twitter Bootstrap to manage the workflow between tabs.
Can be used also to check Parsley validation before move from a tab to another.

## Installation :
```sh
 bower install --save nit-tabs-validation
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
     var identification = $('.inform_cn_validation').parsley();
     var info_demandeur = $('.info_demand_validation').parsley();
     var rules = {
                1: [identification],//array of parsley instances
                2: [info_demandeur]
            };
 
     var nit = new NickelITValidation('.nit-validation-elem', [1, 2, 3], '.nav.nav-tabs a[data-tab-id]', rules);
     nit.setCanDisableInactiveTabs(false);//set if the library should disable the inactive tabs or not
     nit.setActiveTab(1);//set the initial actived tab
     nit.setNextBtnSelector('.btnNext');//to handle the click on the next button
     nit.setPrevBtnSelector('.btnPrevious');//to handle the click on the prev button
```

## License 
MIT

