/**
 * @ag-grid-community/core - Advanced Data Grid / Data Table supporting Javascript / React / AngularJS / Web Components
 * @version v23.0.2
 * @link http://www.ag-grid.com/
 * @license MIT
 */
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../utils");
var componentAnnotations_1 = require("../widgets/componentAnnotations");
var context_1 = require("../context/context");
var constants_1 = require("../constants");
var managedTabComponent_1 = require("../widgets/managedTabComponent");
var TabbedLayout = /** @class */ (function (_super) {
    __extends(TabbedLayout, _super);
    function TabbedLayout(params) {
        var _this = _super.call(this, TabbedLayout.getTemplate(params.cssClass)) || this;
        _this.items = [];
        _this.params = params;
        if (params.items) {
            params.items.forEach(function (item) { return _this.addItem(item); });
        }
        return _this;
    }
    TabbedLayout.prototype.init = function () {
        this.addDestroyableEventListener(this.getGui(), 'keydown', this.handleKeyDown.bind(this));
    };
    TabbedLayout.prototype.handleKeyDown = function (e) {
        switch (e.keyCode) {
            case constants_1.Constants.KEY_RIGHT:
            case constants_1.Constants.KEY_LEFT:
                e.preventDefault();
                if (!this.eHeader.contains(document.activeElement)) {
                    return;
                }
                var currentPosition = this.items.indexOf(this.activeItem);
                var nextPosition = e.keyCode === constants_1.Constants.KEY_RIGHT ? Math.min(currentPosition + 1, this.items.length - 1) : Math.max(currentPosition - 1, 0);
                if (currentPosition === nextPosition) {
                    return;
                }
                var nextItem = this.items[nextPosition];
                this.showItemWrapper(nextItem);
                nextItem.eHeaderButton.focus();
                break;
            case constants_1.Constants.KEY_UP:
            case constants_1.Constants.KEY_DOWN:
                e.stopPropagation();
                break;
        }
    };
    TabbedLayout.prototype.onTabKeyDown = function (e) {
        _super.prototype.onTabKeyDown.call(this, e);
        var focusableItems = this.focusController.findFocusableElements(this.eBody, '.ag-set-filter-list *, .ag-menu-list *');
        var activeElement = document.activeElement;
        if (this.eHeader.contains(activeElement)) {
            if (focusableItems.length) {
                focusableItems[e.shiftKey ? focusableItems.length - 1 : 0].focus();
            }
        }
        else {
            var focusedPosition = focusableItems.indexOf(activeElement);
            var nextPosition = e.shiftKey ? focusedPosition - 1 : focusedPosition + 1;
            if (nextPosition < 0 || nextPosition >= focusableItems.length) {
                this.activeItem.eHeaderButton.focus();
                return;
            }
            var nextItem = focusableItems[nextPosition];
            if (nextItem) {
                nextItem.focus();
            }
        }
    };
    TabbedLayout.getTemplate = function (cssClass) {
        return "<div class=\"ag-tabs " + cssClass + "\">\n            <div ref=\"eHeader\" class=\"ag-tabs-header " + (cssClass ? cssClass + "-header" : '') + "\"></div>\n            <div ref=\"eBody\" class=\"ag-tabs-body " + (cssClass ? cssClass + "-body" : '') + "\"></div>\n        </div>";
    };
    TabbedLayout.prototype.setAfterAttachedParams = function (params) {
        this.afterAttachedParams = params;
    };
    TabbedLayout.prototype.getMinDimensions = function () {
        var eDummyContainer = this.getGui().cloneNode(true);
        var eDummyBody = eDummyContainer.querySelector('[ref="eBody"]');
        // position fixed, so it isn't restricted to the boundaries of the parent
        eDummyContainer.style.position = 'fixed';
        // we put the dummy into the body container, so it will inherit all the
        // css styles that the real cells are inheriting
        this.getGui().appendChild(eDummyContainer);
        var minWidth = 0;
        var minHeight = 0;
        this.items.forEach(function (itemWrapper) {
            utils_1._.clearElement(eDummyBody);
            var eClone = itemWrapper.tabbedItem.bodyPromise.resolveNow(null, function (body) { return body.cloneNode(true); });
            if (eClone == null) {
                return;
            }
            eDummyBody.appendChild(eClone);
            if (minWidth < eDummyContainer.offsetWidth) {
                minWidth = eDummyContainer.offsetWidth;
            }
            if (minHeight < eDummyContainer.offsetHeight) {
                minHeight = eDummyContainer.offsetHeight;
            }
        });
        this.getGui().removeChild(eDummyContainer);
        return { height: minHeight, width: minWidth };
    };
    TabbedLayout.prototype.showFirstItem = function () {
        if (this.items.length > 0) {
            this.showItemWrapper(this.items[0]);
        }
    };
    TabbedLayout.prototype.addItem = function (item) {
        var eHeaderButton = document.createElement('span');
        eHeaderButton.tabIndex = -1;
        eHeaderButton.appendChild(item.title);
        utils_1._.addCssClass(eHeaderButton, 'ag-tab');
        this.eHeader.appendChild(eHeaderButton);
        var wrapper = {
            tabbedItem: item,
            eHeaderButton: eHeaderButton
        };
        this.items.push(wrapper);
        eHeaderButton.addEventListener('click', this.showItemWrapper.bind(this, wrapper));
    };
    TabbedLayout.prototype.showItem = function (tabbedItem) {
        var itemWrapper = utils_1._.find(this.items, function (wrapper) {
            return wrapper.tabbedItem === tabbedItem;
        });
        if (itemWrapper) {
            this.showItemWrapper(itemWrapper);
        }
    };
    TabbedLayout.prototype.showItemWrapper = function (wrapper) {
        var _this = this;
        if (this.params.onItemClicked) {
            this.params.onItemClicked({ item: wrapper.tabbedItem });
        }
        if (this.activeItem === wrapper) {
            utils_1._.callIfPresent(this.params.onActiveItemClicked);
            return;
        }
        utils_1._.clearElement(this.eBody);
        wrapper.tabbedItem.bodyPromise.then(function (body) {
            _this.eBody.appendChild(body);
            body.focus();
        });
        if (this.activeItem) {
            utils_1._.removeCssClass(this.activeItem.eHeaderButton, 'ag-tab-selected');
        }
        utils_1._.addCssClass(wrapper.eHeaderButton, 'ag-tab-selected');
        this.activeItem = wrapper;
        if (wrapper.tabbedItem.afterAttachedCallback) {
            wrapper.tabbedItem.afterAttachedCallback(this.afterAttachedParams);
        }
    };
    __decorate([
        context_1.Autowired('focusController')
    ], TabbedLayout.prototype, "focusController", void 0);
    __decorate([
        componentAnnotations_1.RefSelector('eHeader')
    ], TabbedLayout.prototype, "eHeader", void 0);
    __decorate([
        componentAnnotations_1.RefSelector('eBody')
    ], TabbedLayout.prototype, "eBody", void 0);
    __decorate([
        context_1.PostConstruct
    ], TabbedLayout.prototype, "init", null);
    return TabbedLayout;
}(managedTabComponent_1.ManagedTabComponent));
exports.TabbedLayout = TabbedLayout;

//# sourceMappingURL=tabbedLayout.js.map
