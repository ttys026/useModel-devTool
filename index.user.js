// ==UserScript==
// @name         useModel devTool
// @namespace    http://umijs.org
// @version      1.0-beta.0
// @description  useModel devTool
// @author       You
// @match        *://*/*
// @require      https://code.jquery.com/jquery-3.5.1.min.js
// @require      https://code.jquery.com/ui/1.12.1/jquery-ui.js
// @run-at       document-end
// @updateURL    https://github.com/tli4/useModel-devTool/raw/master/index.user.js
// @downloadURL  https://github.com/tli4/useModel-devTool/raw/master/index.user.js
// @grant        none
// ==/UserScript==

const boxSvg = `<svg style="font-size: 20px; color: white; position: relative; top: 4px; vertical-align: baseline;" viewBox="0 0 1024 1024" focusable="false" class="" data-icon="inbox" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M885.2 446.3l-.2-.8-112.2-285.1c-5-16.1-19.9-27.2-36.8-27.2H281.2c-17 0-32.1 11.3-36.9 27.6L139.4 443l-.3.7-.2.8c-1.3 4.9-1.7 9.9-1 14.8-.1 1.6-.2 3.2-.2 4.8V830a60.9 60.9 0 0060.8 60.8h627.2c33.5 0 60.8-27.3 60.9-60.8V464.1c0-1.3 0-2.6-.1-3.7.4-4.9 0-9.6-1.3-14.1zm-295.8-43l-.3 15.7c-.8 44.9-31.8 75.1-77.1 75.1-22.1 0-41.1-7.1-54.8-20.6S436 441.2 435.6 419l-.3-15.7H229.5L309 210h399.2l81.7 193.3H589.4zm-375 76.8h157.3c24.3 57.1 76 90.8 140.4 90.8 33.7 0 65-9.4 90.3-27.2 22.2-15.6 39.5-37.4 50.7-63.6h156.5V814H214.4V480.1z"></path></svg>`;
const closeSvg = `<svg style="font-size: 20px; color: white; position: relative; top: 4px; vertical-align: baseline;" viewBox="64 64 896 896" focusable="false" class="" data-icon="close" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 00203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z"></path></svg>`;
let createCount = 0;
let prevDemension = { x: window.innerWidth, y: window.innerHeight };
let stateCache = {};
const EMPTY_STATE = '暂无数据';

(function() {
    'use strict';
    if(window.top !== window.self){
        return;
    }
    $( document ).ready(function() {
        createCount++;
        if(createCount !== 1) {
            return;
        }
        $.getScript( "https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/js/bootstrap.bundle.min.js" ).done(function() {
            const containerDom = document.createElement('div');
            containerDom.id = 'use_model_dev_tool';
            $('html').append(containerDom);
            const container = $(containerDom);
            container.css({
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                backgroundColor: '#74b9ff',
                lineHeight: '50px',
                textAlign: 'center',
                position: 'fixed',
                left: parseFloat(localStorage.getItem("dev_tool_bubble_x") || window.innerWidth - 70),
                top: parseFloat(localStorage.getItem("dev_tool_bubble_y") || window.innerHeight - 70),
                userSelect: 'none',
                zIndex: 9999999,
            });
            container.attr('dev-open', 'false');
            container.append(boxSvg);
            container.draggable({
                scroll: false,
                drag: function( event, ui ) {
                    container.popover('hide');
                    container.empty();
                    container.append(boxSvg);
                    container.attr('dev-open', 'false')
                    ui.position.left = Math.min(Math.max( 16, ui.position.left ), window.innerWidth - 66);
                    ui.position.top = Math.min(Math.max( 16, ui.position.top ), window.innerHeight - 66);
                    localStorage.setItem("dev_tool_bubble_x", ui.position.left);
                    localStorage.setItem("dev_tool_bubble_y", ui.position.top);
                }
            });
            window.onresize = (e) => {
                var distance2Right = prevDemension.x - parseFloat(container.css('left'));
                var distance2Bottom = prevDemension.y - parseFloat(container.css('top'));
                prevDemension = { x: window.innerWidth, y: window.innerHeight };

                const left = Math.min(Math.max(window.innerWidth - distance2Right, 16), window.innerWidth - 66);
                const top = Math.min(Math.max(window.innerHeight - distance2Bottom, 16), window.innerHeight - 66);

                localStorage.setItem("dev_tool_bubble_x", left);
                localStorage.setItem("dev_tool_bubble_y", top);

                container.css('left', `${left}px`)
                container.css('top', `${top}px`)
            }
            const popoverStyle = `.umi_dev_tool_popover {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1060;
  display: block;
  max-width: 600px;
  min-width: 600px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji",
    "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
  font-style: normal;
  font-weight: 400;
  line-height: 1.5;
  text-align: left;
  text-align: start;
  text-decoration: none;
  text-shadow: none;
  text-transform: none;
  letter-spacing: normal;
  word-break: normal;
  word-spacing: normal;
  white-space: normal;
  line-break: auto;
  font-size: 0.875rem;
  word-wrap: break-word;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 0.3rem;
}
.umi_dev_tool_popover .umi_dev_tool_arrow {
  position: absolute;
  display: block;
  width: 1rem;
  height: 0.5rem;
  margin: 0 0.3rem;
}
.umi_dev_tool_popover .umi_dev_tool_arrow::after,
.umi_dev_tool_popover .umi_dev_tool_arrow::before {
  position: absolute;
  display: block;
  content: "";
  border-color: transparent;
  border-style: solid;
}
.bs-popover-auto[x-placement^="top"],
.bs-popover-top {
  margin-bottom: 0.5rem;
}
.bs-popover-auto[x-placement^="top"] > .umi_dev_tool_arrow,
.bs-popover-top > .umi_dev_tool_arrow {
  bottom: calc(-0.5rem - 1px);
}
.bs-popover-auto[x-placement^="top"] > .umi_dev_tool_arrow::before,
.bs-popover-top > .umi_dev_tool_arrow::before {
  bottom: 0;
  border-width: 0.5rem 0.5rem 0;
  border-top-color: rgba(0, 0, 0, 0.25);
}
.bs-popover-auto[x-placement^="top"] > .umi_dev_tool_arrow::after,
.bs-popover-top > .umi_dev_tool_arrow::after {
  bottom: 1px;
  border-width: 0.5rem 0.5rem 0;
  border-top-color: #fff;
}
.bs-popover-auto[x-placement^="right"],
.bs-popover-right {
  margin-left: 0.5rem;
}
.bs-popover-auto[x-placement^="right"] > .umi_dev_tool_arrow,
.bs-popover-right > .umi_dev_tool_arrow {
  left: calc(-0.5rem - 1px);
  width: 0.5rem;
  height: 1rem;
  margin: 0.3rem 0;
}
.bs-popover-auto[x-placement^="right"] > .umi_dev_tool_arrow::before,
.bs-popover-right > .umi_dev_tool_arrow::before {
  left: 0;
  border-width: 0.5rem 0.5rem 0.5rem 0;
  border-right-color: rgba(0, 0, 0, 0.25);
}
.bs-popover-auto[x-placement^="right"] > .umi_dev_tool_arrow::after,
.bs-popover-right > .umi_dev_tool_arrow::after {
  left: 1px;
  border-width: 0.5rem 0.5rem 0.5rem 0;
  border-right-color: #fff;
}
.bs-popover-auto[x-placement^="bottom"],
.bs-popover-bottom {
  margin-top: 0.5rem;
}
.bs-popover-auto[x-placement^="bottom"] > .umi_dev_tool_arrow,
.bs-popover-bottom > .umi_dev_tool_arrow {
  top: calc(-0.5rem - 1px);
}
.bs-popover-auto[x-placement^="bottom"] > .umi_dev_tool_arrow::before,
.bs-popover-bottom > .umi_dev_tool_arrow::before {
  top: 0;
  border-width: 0 0.5rem 0.5rem 0.5rem;
  border-bottom-color: rgba(0, 0, 0, 0.25);
}
.bs-popover-auto[x-placement^="bottom"] > .umi_dev_tool_arrow::after,
.bs-popover-bottom > .umi_dev_tool_arrow::after {
  top: 1px;
  border-width: 0 0.5rem 0.5rem 0.5rem;
  border-bottom-color: #fff;
}
.bs-popover-auto[x-placement^="bottom"] .umi_dev_tool_popover-header::before,
.bs-popover-bottom .umi_dev_tool_popover-header::before {
  position: absolute;
  top: 0;
  left: 50%;
  display: block;
  width: 1rem;
  margin-left: -0.5rem;
  content: "";
  border-bottom: 1px solid #f7f7f7;
}
.bs-popover-auto[x-placement^="left"],
.bs-popover-left {
  margin-right: 0.5rem;
}
.bs-popover-auto[x-placement^="left"] > .umi_dev_tool_arrow,
.bs-popover-left > .umi_dev_tool_arrow {
  right: calc(-0.5rem - 1px);
  width: 0.5rem;
  height: 1rem;
  margin: 0.3rem 0;
}
.bs-popover-auto[x-placement^="left"] > .umi_dev_tool_arrow::before,
.bs-popover-left > .umi_dev_tool_arrow::before {
  right: 0;
  border-width: 0.5rem 0 0.5rem 0.5rem;
  border-left-color: rgba(0, 0, 0, 0.25);
}
.bs-popover-auto[x-placement^="left"] > .umi_dev_tool_arrow::after,
.bs-popover-left > .umi_dev_tool_arrow::after {
  right: 1px;
  border-width: 0.5rem 0 0.5rem 0.5rem;
  border-left-color: #fff;
}
.umi_dev_tool_popover-header {
  padding: 0.5rem 0.75rem;
  margin-bottom: 0;
  font-size: 1rem;
  background-color: #f7f7f7;
  user-select: none;
  border-bottom: 1px solid #ebebeb;
  border-top-left-radius: calc(0.3rem - 1px);
  border-top-right-radius: calc(0.3rem - 1px);
}
.umi_dev_tool_popover-header:empty {
  display: none;
}
#umi_dev_tool_float_right {
  float: right;
  font-weight: 400;
  font-size: 14px;
}
.umi_dev_tool_popover-body {
  padding: 0.5rem 0.75rem;
  overflow-y: auto;
  max-height: 400px;
  min-height: 400px;
  color: #212529;
}`;
            $( `<style>${popoverStyle}</style>`).appendTo( "head" );

            const updateContent = (str) => {
                if(content === EMPTY_STATE) {
                    content = str;
                } else {
                    content += str;
                }
                const scroller = document.getElementsByClassName('umi_dev_tool_popover-body')[0];
                if(scroller) {
                    setTimeout(() => {
                        scroller.scrollTo(0, 9999999);
                    }, 16)
                }
            };

            window.addEventListener('_umi_useModel_update', (e) => {
                const { namespace, data, time, index } = e.detail || {};
                const getTime = () => {
                    const dt = new Date(time);
                    return `${dt.getHours()}:${dt.getMinutes()}:${dt.getSeconds()}`
                };

                const prev = (window._umi_useModel_dev_tool_log || {})[namespace][Number(index) - 1];

                updateContent(`<p><b>${getTime()}「${namespace}」触发更新</b> <a id="umi_dev_tool_id_${namespace}_${index}" class="umi_dev_tool_print">打印 diff</a></p>`)
                Object.entries(data || {}).map(([k, v]) => {
                    if(v !== ((stateCache[namespace] || {})[k] || (prev || {})[k])) {
                        updateContent(`<div><b>${k}</b> 发生了变化<br/>prev: ${(stateCache[namespace] || {})[k] || (prev || {})[k]},<br/>current: ${v}</div><br/>`)
                    }
                });
                stateCache[namespace] = data;
                var popover = container.data('bs.popover');
                popover.setContent();
                container.popover('update');
            })

            let content = EMPTY_STATE;
            container.popover({
                content: () => content,
                title: '<div>UseModel DevTool <div id="umi_dev_tool_float_right"><a id="umi_dev_tool_latest">打印最新数据</a> - <a id="umi_dev_tool_history">打印更新记录</a> - <a id="umi_dev_tool_clear">清屏</a></div></div>',
                offset: -1000,
                html: true,
                template: '<div class="umi_dev_tool_popover" role="tooltip"><div class="arrow umi_dev_tool_arrow"></div><h3 class="popover-header umi_dev_tool_popover-header"></h3><div class="popover-body umi_dev_tool_popover-body"></div></div>',
            });

            container.on('click', (e) => {
                if(container.attr('dev-open') == 'true') {
                    container.attr('dev-open', 'false')
                    container.empty();
                    container.append(boxSvg);
                    container.popover('hide');
                } else {
                    container.attr('dev-open', 'true')
                    container.empty();
                    container.append(closeSvg);
                    container.popover('show');

                    const scroller = document.getElementsByClassName('umi_dev_tool_popover-body')[0];
                    if(scroller) {
                        setTimeout(() => {
                            scroller.scrollTo(0, 9999999);
                        })
                    }

                    var popover = container.data('bs.popover');
                    popover.tip.onclick = function(e) {
                        if(e.target.id === 'umi_dev_tool_clear') {
                            content = EMPTY_STATE;
                            popover.setContent();
                            container.popover('update');
                        }
                        if(e.target.id === 'umi_dev_tool_latest') {
                            console.log(window._umi_useModel_dev_tool)
                        }
                        if(e.target.id === 'umi_dev_tool_history') {
                            console.log(window._umi_useModel_dev_tool_log)
                        }
                        if(e.target.className === 'umi_dev_tool_print') {
                            const idList = e.target.id.split('_');
                            const id = Number(e.target.id.split('_')[idList.length - 1]);
                            const namespace = e.target.id.split('_')[idList.length - 2];
                            const prev = (window._umi_useModel_dev_tool_log || {})[namespace][id - 1];
                            const current = (window._umi_useModel_dev_tool_log || {})[namespace][id];
                            console.log(namespace, prev, current);
                        }
                    }
                }
            })
        })
    });
})();
