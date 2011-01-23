//asserters.expresso.js

var asserters = require('it-is/assert')
  , assert = require('assert')

var a,b,c,d,e
var examples =
{ ok : {
    pass : [[1], [2], [-1], ['sadf'], [true], [[]], [{}]]
  , fail : [[0],[false],[null],[undefined]]
  }
  
, equal : {
    pass : [ [1,1], [2,2.0], [-1,-1], ['sadf','sadf'], [true,1]
           , [a = [], a], [b = {}, b]]
  , fail : [ [0,1], [[],[]] ]
  }
  
, typeof : {
    pass : [ [1, 'number']
           , [NaN, 'number']
           , ['', 'string']
           , [{}, 'object']
           , [null,'object']
           , [undefined, 'undefined'] ]
  , fail : [ [0, 'string'] ]
  }
  
, instanceof : {
    pass : [ [{}, Object], [[], Object], [[], Array]
           , [new Error, Error], [function (){}, Function]]
  , fail : [ [{}, Array] ]
  }
, has : {// has basicially checks if expected is a sub tree of actual.
    pass : [ [{a: 1}, {a: 1}]
           , [{a: 1, b: 2}, {a: 1}]
           , [{a: 1}, {a: assert.ok}]  //also, it applies functions in expected 
           ]
  , fail : [ [{a: 1}, {a: 1, b: 2}]
           , [{a: 1}, {a: {}}] 
           , [{}, {a: {}}] 
           , [{a: false}, {a: assert.ok}] 
           ]
  }
, every : { 
    pass : [ [[1,2,3,4,5],assert.ok] ]
  , fail : [ [[1,2,3,4,5,false],assert.ok] ]
  }

, primitive : {
    pass : [ [1], [2], [3], ['sadgsdf'] [true], [false], [undefined] ]
  , fail : [ [null], [[]], [{}], [new Error], [function (){}] ]
  }

, complex : {
    pass : [ [null], [[]], [{}], [new Error], [function (){}] ]
  , fail : [ [1], [2], [3], ['sadgsdf'] [true], [false], [undefined] ]
  }
, function : {
    pass : [ [function(){}], [/asdf/], [Error], [({}).constructor] ]
  , fail : [ [1], [2], [3], ['sadgsdf'] [true], [false], [undefined] ]
  }
, matches : {
    pass : [ ['hello', /\w+/] , ['asdgsadg', /[a|s|d|g]+/] ]
  , fail : [ ['sgfg-', /^\w+$/] ]
  }
//like (actual,expected,{case:boolean,whitespace:boolean,quotes:boolean}) //all default to on.

, like : {
    pass : 
    [ ['hello\n', 'hello'] 
    , ['asdgsadg', 'ASDGSADG']
    , ['"quoted"', "'quoted'"]
    ]
  , fail : 
    [ ['hello\n', 'hello', {whitespace: true}] 
    , ['asdgsadg', 'ASDGSADG', {case: true}]
    , ['"quoted"', "'quoted'", {quotes: true}]
    ]
  }
}

exports ['check examples'] = function (test){
//  check('ok')
  for(i in examples){
    check(i)
  }
}

function check(name){
  //check passes
  examples[name].pass.forEach(function (e,k){
    asserters[name].apply(null,e)
  })
  //check fails
  examples[name].fail.forEach(function (e){
    try {
    asserters[name].apply(null,e)
    } catch (err){
      if(!(err instanceof assert.AssertionError))
        throw err
      return
    }
    assert.ok(false,"expected " + name + "(" + e.join() + ") to fail")
  })
}
  
exports ['every'] = function (test){
  asserters.every([1,2,3,4,5,6],function (x){
    test.ok('number' == typeof x)
  })
  test.throws(function(){  
    asserters.every([1,2,'asda',4,5,6],function (x){
      test.ok('number' == typeof x)
    })
  })
}


exports ['throws can check what object is thrown'] = function (test){

  var examples = 
  [ [ 'throws', 
      [ function () {throw "HELLO"}
      , function (thrown) { test.equal(thrown,"HELLO") } ] ]
  , [ 'throws', 
      [ function () {throw "HELLO"} ] ]
  ]
  examples.forEach(function (c){
    asserters[c[0]].apply(null,c[1])
  })
}


exports ['every intercepts error, records item errored at'] = function (test){
  var examples = 
  [ [ [1,2,3,4,5,null], assert.ok, 5] 
  , [ [null,'sadf','sadfg'], assert.ok, 0] 
  , [ [null,null,null,1], assert.ifError, 3]
  ]
  //  asserters.every([null,null,null,1], assert.ifError)
    
  examples.forEach(function (e){
    try {  
      asserters.every(e[0],e[1])
    } catch (err) {
      test.equal(err.index,e[2])
    }
  })
}

exports ['has intercepts error, records path item errored at'] = function (test){

  var examples = 
  [ [ {a: null}, {a: assert.ok}, ['a']] 
  , [ {'a-b-c': {0: {x: false } } }, {'a-b-c': {0 : {x:assert.ok}}}, ['a-b-c',0,'x']] 
  , [ {a:{}},{a:{b: 1}}, ['a','b']]
  ]

//  asserters.has()
    
  examples.forEach(function (e){
    try {  
      asserters.has(e[0],e[1])
    } catch (err) {
      return test.deepEqual(err.path,e[2])
    }
    test.ok(false,"expected has to throw error at path " + inspect(e[2]))
  })

}
