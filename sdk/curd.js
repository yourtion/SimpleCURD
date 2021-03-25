// @ts-check
"use strict";

/**
 * @file CURD SDK
 * @version 1.0.0
 * @author Yourtion Guo <yourtion@gmail.com>
 */

(function() {
  var base = "/api";

  /**
   * 原生ajax
   */
  function ajax(config, cb) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open(config.method || "GET", config.url, true);
    xmlhttp.setRequestHeader("Content-Type", "application/json");
    xmlhttp.onreadystatechange = function() {
      if (!cb || !(cb instanceof Function)) return;
      if (xmlhttp.readyState == 4 && xmlhttp.status >= 200 && xmlhttp.status <= 299) {
        try {
          var json = JSON.parse(xmlhttp.responseText);
          if (json.success && json.result) {
            return cb(null, json.result);
          } else {
            return cb(new Error(json.msg || json.message || json));
          }
        } catch (e) {
          cb(e);
        }
      } else if (xmlhttp.readyState == 4 && xmlhttp.status >= 400 && xmlhttp.status <= 599) {
        return cb(new Error(xmlhttp.responseText));
      }
      return;
    };
    xmlhttp.send(config.data || "");
    return xmlhttp;
  }

  var dbModuleName = "CURD";
  var dbModule = (function() {
    var host = base + "/collect";
    /**
     * @alias DBCURD
     * @class
     * @classdesc 数据管理平台SDK
     *
     * @param {String} table 表名
     * @param {Object} option 初始化参数
     * @param {String} option.field 默认主键（id）
     * @param {String} option.host 主机
     *
     * @example
     * var client = new DBCURD("test_curd", { field: "openid" });
     */
    var client = function(table, option) {
      // @ts-ignore
      option = option || {};
      this.table = table;
      this.field = option.field || "id";
      this.host = option.host || host;
    };

    /**
     * 获取表信息
     * @param {(err: Error | null, ret?) => void} cb 回调
     *
     * @example
     * client.info(console.log);
     */
    client.prototype.info = function(cb) {
      return this.ajaxGet("/" + this.table, cb);
    };

    client.prototype._list = function(listInfo, cb) {
      var query = [];
      if (listInfo.addtion && typeof listInfo.addtion === "object") {
        for (var k in listInfo.addtion) {
          query.push(k + "=" + listInfo.addtion[k]);
        }
      }
      if (listInfo.page !== undefined) query.push("page=" + listInfo.page);
      if (listInfo.pageCount !== undefined) query.push("page_count=" + listInfo.pageCount);
      if (listInfo.order !== undefined) query.push("order=" + listInfo.order);
      if (listInfo.asc !== undefined) query.push("asc=" + listInfo.asc);
      if (listInfo.limit !== undefined) query.push("limit=" + listInfo.limit);
      if (listInfo.offset !== undefined) query.push("offset=" + listInfo.offset);
      if (listInfo.fields !== undefined) query.push("$fields=" + listInfo.fields.join(","));
      if (listInfo.count || listInfo.page || listInfo.pageCount) {
        query.push("$count=" + "true");
      } else {
        query.push("$count=" + "false");
      }
      return this.ajaxGet("/" + this.table + "/list?" + query.join("&"), cb);
    };

    /**
     * 获取列表
     * @param {Object} listInfo 分页参数
     * @param {Number} listInfo.limit 获取数据数量
     * @param {Number} listInfo.offset 跳过条数
     * @param {Boolean} listInfo.fields 所选字段
     * @param {Object} listInfo.addtion 更多筛选字段
     * @param {(err: Error | null, ret?) => void} cb 回调
     *
     * @example
     * client.list({ limit: 2, offset: 2 }, console.log)
     */
    client.prototype.list = function(listInfo, cb) {
      return this._list(listInfo, function(err, data) {
        if (err) return cb(err);
        cb(null, data.list);
      });
    };

    /**
     * 获取列表
     * @param {Object} pageInfo 分页参数
     * @param {Number} pageInfo.page 第n页
     * @param {Number} pageInfo.pageCount 每页数量
     * @param {String} pageInfo.order 排序字段
     * @param {Boolean} pageInfo.asc 是否升序
     * @param {Boolean} pageInfo.fields 所选字段
     * @param {Object} pageInfo.addtion 更多筛选字段
     * @param {(err: Error | null, ret?) => void} cb 回调
     *
     * @example
     * client.list({ page: 2 }, console.log)
     */
    client.prototype.page = function(pageInfo, cb) {
      return this._list(pageInfo, cb);
    };

    /**
     * 创建记录
     * @private
     * @param {Object} data 收集的数据
     * @param {Boolean} update 插入冲突是否更新数据
     * @param {Boolean} info 是否需要数据详情
     * @param {(err: Error | null, ret?) => void} cb 回调
     *
     * @example
     * client.create({ username: "Yourtion" }, console.log)
     */
    client.prototype._create = function(data, update, info, cb) {
      var opt = {};
      if (data) opt.data = data;
      if (update) opt.update = true;
      if (info) opt.info = true;
      return this.ajaxPost("/" + this.table, opt, cb);
    };
    /**
     * 创建记录
     * @param {Object} data 收集的数据
     * @param {(err: Error | null, ret?) => void} cb 回调
     */
    client.prototype.create = function(data, cb) {
      return this._create(data, false, false, cb);
    };

    /**
     * 更新数据
     * @private
     * @param {String} field 唯一键名
     * @param {String} value 唯一键的值
     * @param {Object} data 更新的数据
     * @param {(err: Error | null, ret?) => void} cb 回调
     */
    client.prototype._update = function(field, value, data, cb) {
      var opt = {};
      if (field) opt.field = field;
      if (data) opt.data = data || {};
      data[field] = value;
      return this.ajaxPut("/" + this.table, opt, cb);
    };
    /**
     * 更新数据
     * @param {String} key 主键的值
     * @param {Object} data 更新的数据
     * @param {(err: Error | null, ret?) => void} cb 回调
     *
     * @example
     * client.update(23248, { username: "Yourtion2" }, console.log)
     */
    client.prototype.update = function(key, data, cb) {
      return this._update(this.field, key, data, cb);
    };

    /**
     * 获取单条数据和排名
     * @private
     * @param {String} field 唯一键名
     * @param {String} data 查询键的值
     * @param {String} rankKey 排名的键
     * @param {Boolean} count 计算总数
     * @param {(err: Error | null, ret?) => void} cb 回调
     */
    client.prototype._get = function(field, data, rankKey, count, cb) {
      var query = [];
      if (field) query.push("field=" + field);
      if (data) query.push("data=" + encodeURIComponent(data));
      if (rankKey) query.push("rank=" + rankKey);
      if (count) query.push("count=" + true);
      return this.ajaxGet("/" + this.table + "/item?" + query.join("&"), cb);
    };
    /**
     * 获取单条数据和排名
     * @param {String} value 查询键的值
     * @param {String} rankKey 排名的键
     * @param {(err: Error | null, ret?) => void} cb 回调
     *
     * @example
     * client.rank(23248, "id", console.log)
     */
    client.prototype.rank = function(value, rankKey, cb) {
      return this._get(this.field, value, rankKey, true, cb);
    };
    /**
     * 获取单条数据
     * @param {String} value 查询键的值
     * @param {(err: Error | null, ret?) => void} cb 回调
     *
     * @example
     * client.get(23248, console.log)
     */
    client.prototype.get = function(value, cb) {
      return this._get(this.field, value, undefined, false, cb);
    };

    /**
     * 数据条目自增
     * @private
     * @param {String} primary 主键的值
     * @param {String} field 需要自增的字段名
     * @param {Number} count 需要自增数量（默认1）
     * @param {(err: Error | null, ret?) => void} cb 回调
     */
    client.prototype._incr = function(primary, field, count, cb) {
      var opt = {
        primaryName: this.field
      };
      if (primary) opt.primary = primary + "";
      if (field) opt.field = field;
      if (count) opt.count = count;
      return this.ajaxPost("/" + this.table + "/incr", opt, cb);
    };
    /**
     * 数据条目自增 1
     * @param {String} primary 主键的值
     * @param {String} field 需要自增的字段名
     * @param {(err: Error | null, ret?) => void} cb 回调
     *
     * @example
     * client.incr(23248, "weight", console.log)
     */
    client.prototype.incr = function(primary, field, cb) {
      return this._incr(primary, field, 1, cb);
    };

    client.prototype.ajax = ajax;

    client.prototype.ajaxGet = function(url, cb) {
      return this.ajax({ url: this.host + url }, cb);
    };

    client.prototype.ajaxPost = function(url, data, cb) {
      return this.ajax({ url: this.host + url, method: "POST", data: JSON.stringify(data) }, cb);
    };

    client.prototype.ajaxPut = function(url, data, cb) {
      return this.ajax({ url: this.host + url, method: "PUT", data: JSON.stringify(data) }, cb);
    };
    return client;
  })();

  // @ts-ignore
  if (typeof module !== "undefined" && typeof exports === "object") {
    module.exports = dbModule;
    // @ts-ignore
  } else if (typeof define === "function" && (define.amd || define.cmd)) {
    // @ts-ignore
    define(function() {
      return dbModule;
    });
  } else {
    window[dbModuleName] = dbModule;
  }
})();
