'use strict'

var _ = require('lodash');

module.exports = {

  informationGain: function(attribute, examples, target) {
    // need to know the entropy of the target
    var targetEntropy = this.entropy(target, examples);
    return targetEntropy - this.remainder(attribute, examples, target);
  },

  entropy: function(attribute, examples) {
    var values = _.pluck(examples, attribute);
    var uniqueValues = _.uniq(values);
    var args = [];
    for (var i = 0; i < uniqueValues.length; i++) {
      args.push(this.proportion(uniqueValues[i], values));
    }
    return this.ent(args);
  },

  ent: function(args) {
    var utils = this;
    args = args.map(function(arg) {
      if (arg === 0) {
        return 0;
      }
      return -arg * utils.log(arg, 2);
    });
    return utils.sum(args);
  },

  log: function(n, base){
    return Math.log(n) / Math.log(base);
  },

  remainder: function(attribute, examples, target) {
    var attributeValues = _.pluck(examples, attribute);
    var targetValues = _.pluck(examples, target);
    var uniqueAttributeValues = _.uniq(attributeValues);
    var uniqueTargetValues = _.uniq(targetValues);

    var outputs = uniqueAttributeValues.map(function(v) {
      var filtered = examples.filter(function(example) {
        return example[attribute] === v;
      });
      return _.pluck(filtered, target);
    });
    var utils = this;
    outputs = outputs.map(function(output) {
      var proportions = uniqueTargetValues.map(function(v) {
        return utils.proportion(v, output);
      });
      return output.length/targetValues.length * utils.ent(proportions);
    });
    return utils.sum(outputs);
  },

  sum: function(array) {
    return array.reduce(function(a, b) { return a+b }, 0);
  },

  proportion: function(value, data) {
    var count = 0;
    for (var i = 0; i < data.length; i++) {
      if (data[i] === value) {
        count++;
      }
    }
    return count/data.length;
  },

  pluralityValue: function(examples, target) {
    var utils = this;
    var values = _.pluck(examples, target);
    var uniqueValues = _.uniq(values);
    var proportions = uniqueValues.map(function(v) {
      return utils.proportion(v, values);
    });
    var max = _.max(proportions);
    return uniqueValues[proportions.indexOf(max)];
  },

  chooseAttribute: function(examples, attributes, target) {
    var utils = this;
    var igs = attributes.map(function(a) {
      return utils.informationGain(a, examples, target);
    });
    var max = _.max(igs);
    return attributes[igs.indexOf(max)];
  }

}