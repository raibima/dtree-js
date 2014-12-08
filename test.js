var utils = require('./utils');
var DTree = require('./dtree');
var fs = require('fs');
var _ = require('lodash');

// BEFORE
var examples = JSON.parse(fs.readFileSync('data.json').toString());
var target = 'wait';
var attributes = ["alternative", "bar", "fri_or_sat", "hungry", "patrons", "price", "rain", "reservation", "type", "waiting_time"];


// UNIT TESTS
var tests = [

  // 1. Entropy
  function() {
    var entropy = utils.entropy(target, examples);
    return floatEqual(entropy, 1.0, 0.0001);
  },

  // 2. Sum
  function() {
    var arr = [10,10,10,10,10,10,10,10,10,10];
    var sum = utils.sum(arr);
    return integerEqual(sum, 100);
  },

  // 3. Proportion
  function() {
    var proportion = utils.proportion(true, _.pluck(examples, target));
    return floatEqual(proportion, 0.5, 0.1);
  },

  // 4. Ent
  function() {
    var entropy = utils.ent([0.5,0.5]);
    return floatEqual(entropy, 1.0, 0.1);
  },

  // 5. Remainder
  function() {
    var remainder = utils.remainder('patrons', examples, target);
    return floatEqual(remainder, 0.4592, 0.0001);
  },

  // 6. Information Gain
  function() {
    var ig = utils.informationGain('patrons', examples, target);
    return floatEqual(ig, 0.541, 0.001);
  },

  // 7. Plurality Value
  function() {
    var pv = utils.pluralityValue(examples, 'price');
    return integerEqual(pv, 1);
  },

  // 8. Choose Attribute
  function() {
    var attr = utils.chooseAttribute(examples, attributes, target);
    return stringEqual(attr, 'patrons')
  },

  // 9. DTree
  function() {
    var dtree = new DTree(examples, attributes, target);
    var prediction = dtree.predict({ patrons: 3 });
    return booleanEqual(prediction, false);
  }

];

module.exports = tests;

// ASSERTIONS
var run = function(test) {
  return test();
}

var floatEqual = function(a, b, tolerance) {
  return Math.abs(a-b) <= tolerance;
}

var integerEqual = function(a, b) {
  return a === b;
}

var booleanEqual = function(a, b) {
  return a === b;
}

var stringEqual = function(a, b) {
  return a === b;
}


// TEST SCRIPT
var passed = 0;
var failed = 0;
tests.forEach(function(test, i) {
  if (test()) {
    console.log('test %d passed', i+1);
    passed++;
  } else {
    console.log('test %d failed', i+1);
    failed++;
  }
});

console.log('DONE! %d passed, %d failed', passed, failed);