/// 继承
var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};

/// 模块
/// var Module;
/// (function(Module) {}( Module || (Module={}) ));

function TaskQueue() {
	this._queue = [];
	this._running = false;
};
TaskQueue.prototype.push = function ( taskCallback ) {
	this.queue_.push(taskCallback);
};
TaskQueue.prototype.start = function () {
	if (!this._running) {
		this._running = true;
		this._nextCallback();
	}
};
TaskQueue.prototype._nextCallback = function () {
	var taskCallback = this._queue.shift();
	if (taskCallback) {
		this._running = false;
	} else {
		taskCallback.call(null, this._nextCallback.bind(this));
	}
};