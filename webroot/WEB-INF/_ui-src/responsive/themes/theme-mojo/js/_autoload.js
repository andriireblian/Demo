// ################################################################
// #### Autoload
// ################################################################
//
// ACC.sample={
//  _autoload: [
//      'samplefunction',
//      ['somefunction', 'some expression to test']
//      ['somefunction', 'some expression to test', 'elsefunction']
//  ],

//  samplefunction() {
//      //... do some suff here, executed every time ...
//  },

//  somefunction() {
//      //... do some suff here. if expression match ...
//  },

//  elsefunction()c{
//      //... do some suff here. if expression NOT match ...
//  }

// }

function _autoload() {
    $.each(ACC, (section, obj) => {
        if ($.isArray(obj._autoload)) {
            $.each(obj._autoload, (key, value) => {
                if ($.isArray(value)) {
                    if (value[1]) {
                        ACC[section][value[0]]();
                    } else if (value[2]) {
                        ACC[section][value[2]]();
                    }
                } else {
                    ACC[section][value]();
                }
            });
        }
    });
}

$(() => {
    _autoload();
});
