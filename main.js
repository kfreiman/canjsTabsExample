$(function() {
    'use strict'

    // модель для общего компонента вкладок
    var TabsViewModel = can.Map.extend({
        tabs: [],
        active: null,
        addTab: function(tab) {
            var tabs = this.attr("tabs")
            tabs.push(tab)

            // по умолчанию активирую первую вкладку
            if (tabs.attr("length") === 1) {
                this.activateById(tab.attr('id'));
            }
        },
        activateById: function(tab_id) {
            var active = this.attr("active")
            var tab = this.findTabById(tab_id)
            if (tab) {
                active && active.attr("visible", false)
                this.attr("active", tab.attr("visible", true))
            }
        },
        findTabById: function(tab_id) {
            var tabs = this.attr("tabs")
            for (var i = 0; i < tabs.length; i++) {
                if (tabs[i].attr("id") == tab_id) {
                    return tabs[i]
                }
            }
        }
    })

    // общий компонент вкладок
    can.Component.extend({
        tag: "tabs",
        viewModel: TabsViewModel,
        template: "<ul class='nav nav-tabs'>\
            {{#each tabs}}\
                <li class='{{#if visible}}active{{/if}}' tab_id={{id}}>\
                    <a>{{caption}}</a>\
                </li>\
            {{/each}}\
        </ul>\
        <content />", // меню и контент вкладок. Видна только активная вкладка
        events: {
            'li click': function(el, ev) {
                // переключаю вкладки по клику
                var element = this.element
                if (!element.attr('trigger') || (element.attr('trigger') == 'click')) {
                    can.route.attr('tab', el.attr('tab_id'))
                }
            },
            'li mouseover': function(el, ev) {
                // переключаю вкладки по наведению
                if (this.element.attr('trigger') == 'hover') {
                    can.route.attr('tab', el.attr('tab_id'))
                }
            },
        }
    })

    // компонент отдельной вкладки
    can.Component.extend({
        tag: "tab",
        template: "{{#if visible}}<content />{{/if}}",
        viewModel: {
            caption: "@",
            id: "@",
        },
        events: {
            inserted: function() {
                // в момент рендеринга добавляю вкладку в общий компонент
                this.element.parent().viewModel().addTab(this.viewModel)
            },
        }
    })

    // рендеринг
    var frag = can.view("app-template", {})
    $("#my-app").html(frag)


    // активирую соответствующую вкладку при определённом URL
    can.route(":tab").bind("tab", function(ev, newVal) {
        var tab = $('#' + newVal)
        if (tab.length) {
            tab.parent().viewModel().activateById(tab.viewModel().id)
        }
    })
    can.route.ready()
})
