$(function() {
    $('body').body();
});

/**
 * Меню
 */
$.widget('presentator.menu', {
	/**
	 * http://api.jqueryui.com/jQuery.widget/#method-_create
	 */
    _create: function() {
        this.selected = null;
        /**
         * Каолличество элементов в меню
         */
        this._max = null;
        
        /**
         * Геттер для колличества элементов
         */
        Object.defineProperty(this, 'max', {
            get: function() {
                if (this._max == null) {
                    this._max = $('li', this.element).length - 1;
                }
                
                return this._max;
            }
        });
        
        /**
         * Элементы меню
         */
        Object.defineProperty(this, 'html', {
            get: function() {
                return this.element.html();
            },
            set: function(html) {
            	this.element.html(html);
            	this._max = null;
            	this.selected = null;
            }
        });
        
        this.element.on('dblclick' + this.eventNamespace, $.proxy(this, 'pin'));
        this.element.on('click' + this.eventNamespace, '>li', $.proxy(this, '_select'));
    },
    /**
     * Закрепление меню
     * @param {Event} e
     */
    pin: function(e) {
        this.element.toggleClass('pinned');
    },
    /**
     * Выбор элемента меню по индексу
     * @param {Number} index
     */
    select: function(index) {
        if (this.selected !== index && index >= 0 && index <= this.max) {
            $('li', this.element).get(index).click();
        }
    },
    /**
     * Следующий элемент
     */
    next: function() {
    	if (this.selected === null) {
    		this.select(0)
    	} else {
    		this.select(this.selected + 1)
    	}
    },
    /**
     * Предыдущий элемент
     */
    prev: function() {
    	if (this.selected !== null) {
    		this.select(this.selected - 1)
    	}
    },
    /**
     * Выбор элемента меню (Загрузка по ссылке из элемента)
     * @param {Event} e
     */
    _select: function(e) {
        e.preventDefault();
        
        var that = this, item = $(e.currentTarget);
        
        if (!item.is('.selected')) {
            item.addClass('selected').siblings('li').removeClass('selected');
            
            this.selected = $('li', this.element).index(item);
            
            if (item.data('content')) {
                this._trigger('load', null, item.data('content'));
            } else {
                $.get($('a', item).attr('href'), function(html) {
                    item.data('content', html);
                    that._trigger('load', null, html);
                });
            }
        }
    },
    /**
     * @see http://api.jqueryui.com/jQuery.widget/#method-destroy
     */
    destroy: function() {
    	this.element.off(this.eventNamespace);
    	
    	this._super();
    }
});

$.widget('presentator.body', {
	/**
	 * @see http://api.jqueryui.com/jQuery.widget/#method-_create
	 */
    _create: function() {
        this.article = $('article', this.element);
        
        var that = this;
        this.presentations = $('.menu-left', this.element).menu({
            load: function(e, data) {
                that.slides.html = data;
                that.article.html('');
            }
        }).data('presentatorMenu');
        
        this.slides = $('.menu-bottom', this.element).menu({
            load: function(e, data) {
                that.article.html(data);
            }
        }).data('presentatorMenu');
        
        this.element.on('keyup' + this.eventNamespace, function(e) {
            switch (e.keyCode) {
            	case 37:
            		that.slides.prev();
            	break;
            	case 38:
            		that.presentations.prev();
        		break;
        		case 39:
        			that.slides.next();
    			break;
    			case 40:
    				that.presentations.next();
    			break;
            }
        });
    },
    /**
     * @see http://api.jqueryui.com/jQuery.widget/#method-destroy
     */
    destroy: function() {
        this.element.off(this.eventNamespace);
        
        this.presentations.destroy();
        this.slides.destroy();
        
        this._super();
    }
});