var isPresent = function(value) {
  return value !== null && value !== void 0;
};
var isBlank = function(value) {
  return value === null || value === void 0;
};
var isArray = function(value) {
  return Array.isArray(value);
};
var isFunction = function(value) {
  return typeof value === "function";
};
var isString = function(value) {
  return typeof value === "string";
};
var isNullOrEmptyString = function(value) {
  return isBlank(value) || value.trim().length === 0;
};
var isNotNullOrEmptyString = function(value) {
  return !isNullOrEmptyString(value);
};
var isNumeric = function(value) {
  return !isNaN(value - parseFloat(value));
};
var isDate = function(value) {
  return value && value.getTime;
};
var isCompositeFilterDescriptor = function(source) {
  return isPresent(source.filters);
};
var ifElse = function(predicate, right, left) {
  return function(value) {
    return predicate(value) ? right(value) : left(value);
  };
};
var compose = function() {
  var args = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    args[_i] = arguments[_i];
  }
  return function(data) {
    return args.reduceRight(function(acc, curr) {
      return curr(acc);
    }, data);
  };
};
var toUTC = function(date) {
  return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds()));
};
var isDateValue = function(x) {
  return isDate(x.value);
};
var getterCache = {};
var FIELD_REGEX = /\[(?:(\d+)|['"](.*?)['"])\]|((?:(?!\[.*?\]|\.).)+)/g;
getterCache["undefined"] = function(obj) {
  return obj;
};
var getter = function(field, safe) {
  var key = field + safe;
  if (getterCache[key]) {
    return getterCache[key];
  }
  var fields = [];
  field.replace(FIELD_REGEX, function(_, index, indexAccessor, field2) {
    fields.push(isPresent(index) ? index : indexAccessor || field2);
    return void 0;
  });
  getterCache[key] = function(obj) {
    var result = obj;
    for (var idx = 0; idx < fields.length; idx++) {
      result = result[fields[idx]];
      if (!isPresent(result) && safe) {
        return result;
      }
    }
    return result;
  };
  return getterCache[key];
};
var pairwise = function(key) {
  return function(value) {
    return [key, value];
  };
};
var empty = function() {
  return null;
};
var isNotEmptyArray = function(value) {
  return isPresent(value) && isArray(value) && value.length > 0;
};
var isNotEmpty = function(accessor) {
  return function(value) {
    return isNotEmptyArray(accessor(value));
  };
};
var runOrEmpty = function(predicate, fn) {
  return ifElse(predicate, fn, empty);
};
var calcPage = function(_a) {
  var skip2 = _a.skip, take2 = _a.take;
  return Math.floor((skip2 || 0) / take2) + 1;
};
var formatDescriptors = function(accessor, formatter) {
  return function(state) {
    return accessor(state).map(formatter).join("~");
  };
};
var removeAfter = function(what) {
  return function(str) {
    return str.slice(0, str.indexOf(what));
  };
};
var replace = function(patterns) {
  return compose.apply(void 0, patterns.map(function(_a) {
    var left = _a[0], right = _a[1];
    return function(s) {
      return s.replace(new RegExp(left, "g"), right);
    };
  }));
};
var sanitizeDateLiterals = replace([['"', ""], [":", "-"]]);
var removeAfterDot = removeAfter(".");
var directionFormatter = function(_a) {
  var field = _a.field, _b = _a.dir, dir = _b === void 0 ? "asc" : _b;
  return field + "-" + dir;
};
var aggregateFormatter = function(_a) {
  var field = _a.field, aggregate = _a.aggregate;
  return field + "-" + aggregate;
};
var take$1 = getter("take");
var aggregates = getter("aggregates");
getter("skip");
var group = getter("group");
var sort$1 = getter("sort", true);
var formatSort = formatDescriptors(sort$1, directionFormatter);
var formatGroup = formatDescriptors(group, directionFormatter);
var formatAggregates = formatDescriptors(aggregates, aggregateFormatter);
var prefixDateValue = function(value) {
  return "datetime'" + value + "'";
};
var formatDateValue = compose(prefixDateValue, removeAfterDot, sanitizeDateLiterals, JSON.stringify, toUTC);
var formatDate = function(_a) {
  var field = _a.field, value = _a.value, ignoreCase = _a.ignoreCase, operator = _a.operator;
  return {
    value: formatDateValue(value),
    field,
    ignoreCase,
    operator
  };
};
var normalizeSort = function(state) {
  return Object.assign({}, state, {
    sort: (sort$1(state) || []).filter(function(_a) {
      var dir = _a.dir;
      return isNotNullOrEmptyString(dir);
    })
  });
};
compose(pairwise("page"), calcPage);
compose(pairwise("pageSize"), take$1);
compose(pairwise("group"), formatGroup);
var transformSort = compose(pairwise("sort"), formatSort);
compose(pairwise("aggregate"), formatAggregates);
compose(runOrEmpty(isNotEmpty(sort$1), transformSort), normalizeSort);
var filterFormatter = function(_a) {
  var field = _a.field, operator = _a.operator, value = _a.value;
  return field + "~" + operator + "~" + value;
};
ifElse(isDateValue, compose(filterFormatter, formatDate), filterFormatter);
var set = function(field, target, value) {
  target[field] = value;
  return target;
};
var convert = function(mapper) {
  return function(values) {
    return Object.keys(values).reduce(mapper.bind(null, values), {});
  };
};
var translateAggregate = convert(function(source, acc, field) {
  return set(field.toLowerCase(), acc, source[field]);
});
var translateAggregates = convert(function(source, acc, field) {
  return set(field, acc, translateAggregate(source[field]));
});
var valueOrDefault = function(value, defaultValue) {
  return isPresent(value) ? value : defaultValue;
};
var normalizeGroup = function(group2) {
  return {
    aggregates: group2.Aggregates || group2.aggregates,
    field: group2.Member || group2.member || group2.field,
    hasSubgroups: group2.HasSubgroups || group2.hasSubgroups || false,
    items: group2.Items || group2.items,
    value: valueOrDefault(group2.Key, valueOrDefault(group2.key, group2.value))
  };
};
var translateGroup = compose(function(_a) {
  var field = _a.field, hasSubgroups = _a.hasSubgroups, value = _a.value, aggregates2 = _a.aggregates, items = _a.items;
  return {
    aggregates: translateAggregates(aggregates2),
    field,
    items: hasSubgroups ? items.map(translateGroup) : items,
    value
  };
}, normalizeGroup);
var compare = function(a, b) {
  if (isBlank(a)) {
    return a === b ? 0 : -1;
  }
  if (isBlank(b)) {
    return 1;
  }
  if (a.localeCompare) {
    return a.localeCompare(b);
  }
  return a > b ? 1 : a < b ? -1 : 0;
};
var compareDesc = function(a, b) {
  return compare(b, a);
};
var descriptorAsFunc = function(descriptor) {
  var prop = getter(descriptor.field, true);
  return function(a, b) {
    return (descriptor.dir === "asc" ? compare : compareDesc)(prop(a), prop(b));
  };
};
var initial = function(_a, _b) {
  return 0;
};
var composeSortDescriptors = function(descriptors) {
  return descriptors.filter(function(x) {
    return isPresent(x.dir);
  }).map(function(descriptor) {
    return descriptorAsFunc(descriptor);
  }).reduce(function(acc, curr) {
    return function(a, b) {
      return acc(a, b) || curr(a, b);
    };
  }, initial);
};
var valueToString = function(value) {
  value = isPresent(value) && value.getTime ? value.getTime() : value;
  return value + "";
};
var groupCombinator = function(field) {
  var prop = getter(field, true);
  var position = 0;
  return function(agg, value) {
    agg[field] = agg[field] || {};
    var groupValue = prop(value);
    var key = valueToString(groupValue);
    var values = agg[field][key] || { __position: position++, aggregates: {}, items: [], value: groupValue };
    values.items.push(value);
    agg[field][key] = values;
    return agg;
  };
};
var expandAggregates = function(result) {
  if (result === void 0) {
    result = {};
  }
  Object.keys(result).forEach(function(field) {
    var aggregates2 = result[field];
    Object.keys(aggregates2).forEach(function(aggregate) {
      aggregates2[aggregate] = aggregates2[aggregate].result();
    });
  });
  return result;
};
var aggregatesFuncs = function(name) {
  return {
    average: function() {
      var value = 0;
      var count2 = 0;
      return {
        calc: function(curr) {
          if (isNumeric(curr)) {
            value += curr;
            count2++;
          } else {
            value = curr;
          }
        },
        result: function() {
          return isNumeric(value) ? value / count2 : value;
        }
      };
    },
    count: function() {
      var state = 0;
      return {
        calc: function() {
          return state++;
        },
        result: function() {
          return state;
        }
      };
    },
    max: function() {
      var state = Number.NEGATIVE_INFINITY;
      return {
        calc: function(value) {
          state = isNumeric(state) || isDate(state) ? state : value;
          if (state < value && (isNumeric(value) || isDate(value))) {
            state = value;
          }
        },
        result: function() {
          return state;
        }
      };
    },
    min: function() {
      var state = Number.POSITIVE_INFINITY;
      return {
        calc: function(value) {
          state = isNumeric(state) || isDate(state) ? state : value;
          if (state > value && (isNumeric(value) || isDate(value))) {
            state = value;
          }
        },
        result: function() {
          return state;
        }
      };
    },
    sum: function() {
      var state = 0;
      return {
        calc: function(value) {
          return state += value;
        },
        result: function() {
          return state;
        }
      };
    }
  }[name]();
};
var aggregatesCombinator = function(descriptors) {
  var functions = descriptors.map(function(descriptor) {
    var fieldAccessor = getter(descriptor.field, true);
    var aggregateName = (descriptor.aggregate || "").toLowerCase();
    var aggregateAccessor = getter(aggregateName, true);
    return function(state, value) {
      var fieldAggregates = state[descriptor.field] || {};
      var aggregateFunction = aggregateAccessor(fieldAggregates) || aggregatesFuncs(aggregateName);
      aggregateFunction.calc(fieldAccessor(value));
      fieldAggregates[descriptor.aggregate] = aggregateFunction;
      state[descriptor.field] = fieldAggregates;
      return state;
    };
  });
  return function(state, value) {
    return functions.reduce(function(agg, calc) {
      return calc(agg, value);
    }, state);
  };
};
var concat = function(arr, value) {
  arr.push(value);
  return arr;
};
var map = function(transform) {
  return (function(reduce) {
    return (function(acc, curr, index) {
      return reduce(acc, transform(curr, index));
    });
  });
};
var filter = function(predicate) {
  return (function(reduce) {
    return (function(acc, curr) {
      return predicate(curr) ? reduce(acc, curr) : acc;
    });
  });
};
var isTransformerResult = function(source) {
  return isPresent(source.__value);
};
var reduced = function(x) {
  if (isTransformerResult(x)) {
    return x;
  }
  return {
    __value: x,
    reduced: true
  };
};
var take = function(count2) {
  return (function(reduce) {
    return (function(acc, curr) {
      return count2-- > 0 ? reduce(acc, curr) : reduced(acc);
    });
  });
};
var skip = function(count2) {
  return (function(reduce) {
    return (function(acc, curr) {
      return count2-- <= 0 ? reduce(acc, curr) : acc;
    });
  });
};
var exec = function(transform, initialValue, data) {
  var result = initialValue;
  for (var idx = 0, length_1 = data.length; idx < length_1; idx++) {
    result = transform(result, data[idx], idx);
    if (isTransformerResult(result)) {
      result = result.__value;
      break;
    }
  }
  return result;
};
var identity$1 = map(function(x) {
  return x;
});
var aggregateBy = function(data, descriptors, transformers) {
  if (descriptors === void 0) {
    descriptors = [];
  }
  if (transformers === void 0) {
    transformers = identity$1;
  }
  var initialValue = {};
  if (!descriptors.length) {
    return initialValue;
  }
  var result = exec(transformers(aggregatesCombinator(descriptors)), initialValue, data);
  return expandAggregates(result);
};
var operatorMap = function(key) {
  return {
    "!=": "neq",
    "<": "lt",
    "<=": "lte",
    "==": "eq",
    ">": "gt",
    ">=": "gte",
    equal: "eq",
    equals: "eq",
    equalto: "eq",
    ge: "gte",
    greater: "gt",
    greaterthan: "gt",
    greaterthanequal: "gte",
    isempty: "isempty",
    isequalto: "eq",
    isgreaterthan: "gt",
    isgreaterthanorequalto: "gte",
    islessthan: "lt",
    islessthanorequalto: "lte",
    isnotempty: "isnotempty",
    isnotequalto: "neq",
    isnull: "isnull",
    le: "lte",
    less: "lt",
    lessthan: "lt",
    lessthanequal: "lte",
    ne: "neq",
    notequal: "neq",
    notequals: "neq",
    notequalto: "neq",
    notsubstringof: "doesnotcontain"
  }[key.toLowerCase()] || key;
};
var normalizeOperator = function(descriptor) {
  var filters = descriptor.filters || [];
  filters.forEach(function(filter2) {
    if (!isCompositeFilterDescriptor(filter2) && isString(filter2.operator)) {
      filter2.operator = operatorMap(filter2.operator);
    }
    if (isCompositeFilterDescriptor(filter2)) {
      normalizeOperator(filter2);
    }
  });
};
var normalizeDescriptor = function(descriptor) {
  if (!isCompositeFilterDescriptor(descriptor)) {
    return {
      filters: isArray(descriptor) ? descriptor : [descriptor],
      logic: "and"
    };
  }
  return descriptor;
};
var normalizeFilters = function(descriptor) {
  if (isPresent(descriptor)) {
    descriptor = normalizeDescriptor(descriptor);
    normalizeOperator(descriptor);
  }
  return descriptor;
};
var logic = {
  "or": {
    concat: function(acc, fn) {
      return function(a) {
        return acc(a) || fn(a);
      };
    },
    identity: function() {
      return false;
    }
  },
  "and": {
    concat: function(acc, fn) {
      return function(a) {
        return acc(a) && fn(a);
      };
    },
    identity: function() {
      return true;
    }
  }
};
var operatorsMap = {
  contains: function(a, b) {
    return (a || "").indexOf(b) >= 0;
  },
  doesnotcontain: function(a, b) {
    return (a || "").indexOf(b) === -1;
  },
  doesnotendwith: function(a, b) {
    return (a || "").indexOf(b, (a || "").length - (b || "").length) < 0;
  },
  doesnotstartwith: function(a, b) {
    return (a || "").lastIndexOf(b, 0) === -1;
  },
  endswith: function(a, b) {
    return (a || "").indexOf(b, (a || "").length - (b || "").length) >= 0;
  },
  eq: function(a, b) {
    return a === b;
  },
  gt: function(a, b) {
    return a > b;
  },
  gte: function(a, b) {
    return a >= b;
  },
  isempty: function(a) {
    return a === "";
  },
  isnotempty: function(a) {
    return a !== "";
  },
  isnotnull: function(a) {
    return isPresent(a);
  },
  isnull: function(a) {
    return isBlank(a);
  },
  lt: function(a, b) {
    return a < b;
  },
  lte: function(a, b) {
    return a <= b;
  },
  neq: function(a, b) {
    return a != b;
  },
  startswith: function(a, b) {
    return (a || "").lastIndexOf(b, 0) === 0;
  }
};
var dateRegExp = /^\/Date\((.*?)\)\/$/;
var convertValue = function(value, ignoreCase) {
  if (value != null && isString(value)) {
    var date = dateRegExp.exec(value);
    if (date) {
      return (/* @__PURE__ */ new Date(+date[1])).getTime();
    } else if (ignoreCase) {
      return value.toLowerCase();
    }
  } else if (value != null && isDate(value)) {
    return value.getTime();
  }
  return value;
};
var typedGetter = function(prop, value, ignoreCase) {
  if (!isPresent(value)) {
    return prop;
  }
  var acc = prop;
  if (isString(value)) {
    var date = dateRegExp.exec(value);
    if (date) {
      value = /* @__PURE__ */ new Date(+date[1]);
    } else {
      acc = function(a) {
        var x = prop(a);
        if (typeof x === "string" && ignoreCase) {
          return x.toLowerCase();
        } else {
          return isNumeric(x) ? x + "" : x;
        }
      };
    }
  }
  if (isDate(value)) {
    return function(a) {
      var x = acc(a);
      return isDate(x) ? x.getTime() : x;
    };
  }
  return acc;
};
var transformFilter = function(_a) {
  var field = _a.field, ignoreCase = _a.ignoreCase, value = _a.value, operator = _a.operator;
  field = !isPresent(field) ? function(a) {
    return a;
  } : field;
  ignoreCase = isPresent(ignoreCase) ? ignoreCase : true;
  var itemProp = typedGetter(isFunction(field) ? field : getter(field, true), value, ignoreCase);
  value = convertValue(value, ignoreCase);
  var op = isFunction(operator) ? operator : operatorsMap[operator];
  return function(a) {
    return op(itemProp(a), value, ignoreCase);
  };
};
var transformCompositeFilter = function(filter2) {
  var combiner = logic[filter2.logic];
  return filter2.filters.filter(isPresent).map(function(x) {
    return isCompositeFilterDescriptor(x) ? transformCompositeFilter(x) : transformFilter(x);
  }).reduce(combiner.concat, combiner.identity);
};
var compileFilter = function(descriptor) {
  if (!descriptor || descriptor.filters.length === 0) {
    return function() {
      return true;
    };
  }
  return transformCompositeFilter(descriptor);
};
var filterBy = function(data, descriptor) {
  if (!isPresent(descriptor) || isCompositeFilterDescriptor(descriptor) && descriptor.filters.length === 0) {
    return data;
  }
  return data.filter(compileFilter(normalizeFilters(descriptor)));
};
var normalizeGroups = function(descriptors) {
  descriptors = isArray(descriptors) ? descriptors : [descriptors];
  return descriptors.map(function(x) {
    return Object.assign({ dir: "asc" }, x);
  });
};
var identity = map(function(x) {
  return x;
});
var groupBy = function(data, descriptors, transformers, originalData) {
  if (descriptors === void 0) {
    descriptors = [];
  }
  if (transformers === void 0) {
    transformers = identity;
  }
  if (originalData === void 0) {
    originalData = data;
  }
  descriptors = normalizeGroups(descriptors);
  if (!descriptors.length) {
    return data;
  }
  var descriptor = descriptors[0];
  var initialValue = {};
  var view = exec(transformers(groupCombinator(descriptor.field)), initialValue, data);
  var result = [];
  Object.keys(view).forEach(function(field) {
    Object.keys(view[field]).forEach(function(value) {
      var group2 = view[field][value];
      var aggregateResult = {};
      var filteredData = originalData;
      if (isPresent(descriptor.aggregates)) {
        filteredData = filterBy(originalData, {
          field: descriptor.field,
          ignoreCase: false,
          operator: "eq",
          value: group2.value
        });
        aggregateResult = aggregateBy(filteredData, descriptor.aggregates);
      }
      result[group2.__position] = {
        aggregates: aggregateResult,
        field,
        items: descriptors.length > 1 ? groupBy(group2.items, descriptors.slice(1), identity, filteredData) : group2.items,
        value: group2.value
      };
    });
  });
  return result;
};
var merge = function(data, left, middle, right, compare2) {
  var leftLength = middle - left;
  var rightLength = right - middle;
  var temp = [];
  for (var idx = 0; idx < leftLength; idx++) {
    temp.push(data[left + idx]);
  }
  var cursor1 = 0;
  var cursor2 = middle;
  var dest = left;
  do {
    if (compare2(data[cursor2], temp[cursor1]) < 0) {
      data[dest++] = data[cursor2++];
      rightLength--;
    } else {
      data[dest++] = temp[cursor1++];
      leftLength--;
    }
  } while (rightLength > 0 && leftLength > 0);
  while (leftLength) {
    data[dest++] = temp[cursor1++];
    leftLength--;
  }
  while (rightLength) {
    data[dest++] = data[cursor2++];
    rightLength--;
  }
};
var sort = function(data, start, end, compare2) {
  if (end - start < 2) {
    return;
  }
  var mid = start + end >>> 1;
  sort(data, start, mid, compare2);
  sort(data, mid, end, compare2);
  merge(data, start, mid, end, compare2);
};
var orderBy = function(data, descriptors) {
  if (descriptors.some(function(x) {
    return isPresent(x.dir);
  })) {
    data = data.slice(0);
    var comparer = composeSortDescriptors(descriptors);
    sort(data, 0, data.length, comparer);
  }
  return data;
};
var count = function(data, predicate) {
  var counter = 0;
  for (var idx = 0, length_1 = data.length; idx < length_1; idx++) {
    if (predicate(data[idx])) {
      counter++;
    }
  }
  return counter;
};
var limit = function(data, predicate) {
  if (predicate) {
    return data.filter(predicate);
  }
  return data;
};
var process = function(data, state) {
  var skipCount = state.skip, takeCount = state.take, filterDescriptor = state.filter, sort2 = state.sort, group2 = state.group;
  var sortDescriptors = normalizeGroups(group2 || []).concat(sort2 || []);
  if (sortDescriptors.length) {
    data = orderBy(data, sortDescriptors);
  }
  var hasFilters = isPresent(filterDescriptor) && filter.length;
  var hasGroups = isPresent(group2) && group2.length;
  if (!hasFilters && !hasGroups) {
    return {
      data: takeCount ? data.slice(skipCount, skipCount + takeCount) : data,
      total: data.length
    };
  }
  var total;
  var transformers = [];
  var predicate;
  if (hasFilters) {
    predicate = compileFilter(normalizeFilters(filterDescriptor));
    total = count(data, predicate);
    transformers.push(filter(predicate));
  } else {
    total = data.length;
  }
  if (isPresent(skipCount) && isPresent(takeCount)) {
    transformers.push(skip(skipCount));
    transformers.push(take(takeCount));
  }
  if (transformers.length) {
    var transform = compose.apply(void 0, transformers);
    var result = hasGroups ? groupBy(data, group2, transform, limit(data, predicate)) : exec(transform(concat), [], data);
    return { data: result, total };
  }
  return {
    data: hasGroups ? groupBy(data, group2) : data,
    total
  };
};

export { process as p };
//# sourceMappingURL=array.operators-CqYfjdq6.mjs.map
