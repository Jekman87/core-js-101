/* ************************************************************************************************
 *                                                                                                *
 * Plese read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectagle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  this.width = width;
  this.height = height;
}

Rectangle.prototype.getArea = function fn() {
  return this.width * this.height;
};


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  return Object.assign(new proto.constructor(), JSON.parse(json));
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurences
 *
 * All types of selectors can be combined using the combinators ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string repsentation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

class СssBuilder {
  constructor() {
    this.elemStr = '';
    this.idStr = '';
    this.classArr = [];
    this.attrsArr = [];
    this.pseudoClassArr = [];
    this.pseudoElementStr = '';
    this.sequence = 0;
  }

  element(value) {
    this.checkSequence(1);
    this.sequence = 1;
    if (this.elemStr) throw Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    this.elemStr += value;
    return this;
  }

  id(value) {
    this.checkSequence(2);
    this.sequence = 2;
    if (this.idStr) throw Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    this.idStr += `#${value}`;
    return this;
  }

  class(value) {
    this.checkSequence(3);
    this.sequence = 3;
    this.classArr.push(`.${value}`);
    return this;
  }

  attr(value) {
    this.checkSequence(4);
    this.sequence = 4;
    this.attrsArr.push(`[${value}]`);
    return this;
  }

  pseudoClass(value) {
    this.checkSequence(5);
    this.sequence = 5;
    this.pseudoClassArr.push(`:${value}`);
    return this;
  }

  pseudoElement(value) {
    this.checkSequence(6);
    this.sequence = 6;
    if (this.pseudoElementStr) throw Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    this.pseudoElementStr += `::${value}`;
    return this;
  }

  checkSequence(value) {
    if (this.sequence > value) throw Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
  }

  stringify() {
    return this.elemStr
          + this.idStr
          + this.classArr.join('')
          + this.attrsArr.join('')
          + this.pseudoClassArr.join('')
          + this.pseudoElementStr;
  }
}

const cssSelectorBuilder = {
  element(value) {
    const cssBuilder = this.instanse(this);
    return cssBuilder.element(value);
  },

  id(value) {
    const cssBuilder = this.instanse(this);
    return cssBuilder.id(value);
  },

  class(value) {
    const cssBuilder = this.instanse(this);
    return cssBuilder.class(value);
  },

  attr(value) {
    const cssBuilder = this.instanse(this);
    return cssBuilder.attr(value);
  },

  pseudoClass(value) {
    const cssBuilder = this.instanse(this);
    return cssBuilder.pseudoClass(value);
  },

  pseudoElement(value) {
    const cssBuilder = this.instanse(this);
    return cssBuilder.pseudoElement(value);
  },

  combine(selector1, combinator, selector2) {
    this.str = `${selector1.stringify()} ${combinator} ${selector2.stringify()}`;
    return this;
  },

  instanse(instanse) {
    return instanse instanceof СssBuilder ? instanse : new СssBuilder();
  },

  stringify() {
    return this.str ? this.str : this.stringify();
  },
};


module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
