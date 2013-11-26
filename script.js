$(function() {
    $('body').body();
});

/**
 * Меню
 */
$.widget('presentator.menu', {
    _create: function() {
        this.element.on('dblclick' + this.eventNamespace, $.proxy(this, 'pin')).on('click' + this.eventNamespace, '>li', $.proxy(this, '_select'));
    },
    /**
     * Закрепление меню
     * @param {Event} e
     */
    pin: function(e) {
        this.element.toggleClass('pinned');
    },
    /**
     * Выбор элемента меню
     * @param {Event} e
     */
    _select: function(e) {
        e.preventDefault();
        var that = this;
        
        $(e.currentTarget).addClass('selected').siblings('li').removeClass('selected');
        
        $.ajax($('a', e.currentTarget).attr('href'), {
            complete: function(xhr) {
                /* кривенько, но ведь это демка */
                that._trigger('load', null, xhr.responseText);
            }
        })
    }
});

$.widget('presentator.body', {
    _create: function() {
        this.presentations = $('.menu-left', this.element);
        this.slides = $('.menu-bottom', this.element);
        this.article = $('article', this.element);
        
        var that = this;
		this.presentations.menu({
            load: function(e, data) {
            	that.slides.html(data);
            }
        });
        
        this.slides.menu({
        	load: function(e, data) {
        		that.article.html(data);
        	}
        });
        
        this.element.on('keyup' + this.eventNamespace, function() {
        
        });
    }
});