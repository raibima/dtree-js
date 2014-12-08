
var _ = require('lodash');
var utils = require('./utils');

var DecisionTree = function(examples, attributes, target) {
  var targetValues = _.unique(_.pluck(examples, target));
  if (targetValues.length === 1) {
    return {
      type: 'result',
      value: targetValues[0],
      name: targetValues[0]
    };
  }
  if (attributes.length === 0) {
    return {
      type: 'result',
      value: utils.pluralityValue(examples, target)
    };
  }
  var bestAttribute = utils.chooseAttribute(examples, attributes, target);
  this.name = bestAttribute;
  this.type = 'attribute';
  var uniqueAttributeValues = _.uniq(_.pluck(examples, this.name));
  this.branches = uniqueAttributeValues.map(function(v) {
    var exs = examples.filter(function(e) {
      return e[bestAttribute] === v;
    });
    return {
      name: v,
      type: 'branch',
      node: new DecisionTree(exs, _.without(attributes, bestAttribute), target)
    };
  });
}

DecisionTree.prototype.predict = function(data) {
  var node = this;
  while (node.type !== 'result') {
    var attr = node.name;
    var givenValue = data[attr];
    var branch = _.detect(node.branches, function(x) {
      return x.name === givenValue;
    });
    node = branch.node;
  }
  return node.name;
}

DecisionTree.prototype.toJson = function() {
  return JSON.stringify(this);
}

module.exports = DecisionTree;
