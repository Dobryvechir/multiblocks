import { Injectable, 
  ComponentFactoryResolver,
  ApplicationRef,
  Injector,
  EmbeddedViewRef,
  ComponentRef } from '@angular/core';
import { SpnViewButton } from './models/spn-view-button';
import { SpnViewBlockConfig } from './models/spn-view-block-config';
import { SpnViewContentComponent } from './spn-view-content.component';
import { SpnEditBlocks } from './models/spn-edit-block';
import { SpnRollerCoaster } from './spn-roller-coaster.service';

@Injectable()
export class SpnViewManagerService {
    readonly Home='Home';
    readonly Up = 'Up';
    readonly Next = 'Next';
    readonly Previous = 'Previous';
    readonly RecentPage = 'Recent Page';
    readonly Content = 'Content';
    readonly blockName = 'Block ';
    data = '';
    title = '';
    minExpandingThreshold = 10;
    maxChildButtonShow = 7;
    numberOfBlocks = 1;
    lastPage = '';
    nextId = 100;
    currentLevels: number[] = [];
    lastLevels: number[] = [];
    urlToIdMap = {
        "content": "content",
    };
    
    currentBlock: SpnEditBlocks;
    allBlocks: SpnEditBlocks[] = [];
    buttonList: SpnViewButton[] = [];
    contentComponentRef: ComponentRef<SpnViewContentComponent>

    constructor(private componentFactoryResolver: ComponentFactoryResolver,
               private appRef: ApplicationRef,
               private injector: Injector,
               private rollerCoaster: SpnRollerCoaster) {
       const blockConfig = window['SpnViewBlockConfig'] as SpnViewBlockConfig;
       const info = blockConfig && blockConfig.textAreaId && document.getElementById(blockConfig.textAreaId) &&
           document.getElementById(blockConfig.textAreaId)['value'];
       if (!info)  {
            window.console.log("Manager Service is idle");
            return;
       }
       this.initPages(info); 
    }

    createDynamicBlock(): void {
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(SpnViewContentComponent);
        const componentRef = componentFactory.create(this.injector);
        this.appRef.attachView(componentRef.hostView);
        const domElem = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
        domElem.style.display = "none";
        document.body.appendChild(domElem);
        this.rollerCoaster.popupElement = domElem;
        this.contentComponentRef = componentRef;
        window.addEventListener("hashchange", this.onContextChanged.bind(this), false);
        this.onContextChanged();
    }

    initPages(mainBlockValue:string): void {
       mainBlockValue=mainBlockValue.trim();
       try {
           if (mainBlockValue) {
                    let mainBlock: SpnEditBlocks = {};
                    if (mainBlockValue.charAt(0) === "{") {
                        mainBlock = JSON.parse(mainBlockValue) as SpnEditBlocks;
                    } else {
                        mainBlock = {
                            kids: [
                                {
                                    title: "More...",
                                    info: mainBlockValue
                                }
                            ]
                        }
                    }
                    if (!mainBlock.title) {
                       mainBlock.title = "Main";
                    }
                    this.allBlocks = [mainBlock];
                    this.numberOfBlocks = 0;
                    this.recalculateLevels(this.allBlocks, 0, '', '');
          }
       } catch (e) {
                 window.console.log("SpnEditBlockNodes has been reset",e);
       }
 
    }

    public fullInit(): void {
        if (this.numberOfBlocks<2) {
            return;
        }
        this.createDynamicBlock();
    }
    
    onContextChanged(): void {
       this.getCurrentPageInfo();
    }

    public getCurrentPageInfo() {
        let pageUrl = window.location.hash;
        if (pageUrl!="" && pageUrl[0]==='#') {
             pageUrl=pageUrl.substring(1);
        }
        if (pageUrl!="" && pageUrl[0]==='/') {
             pageUrl=pageUrl.substring(1);
        }
        this.setCurrentPage(this.urlToIdMap[pageUrl]);
    }

    private addButton(name:string, url:string) {
        name = window['dieSeiteUbersetzungen'] && window['dieSeiteUbersetzungen'][name] || name;
        this.buttonList.push({name,url});
    }

    private addButtonForBlock(prefix:string, block:SpnEditBlocks) {
        if (block) {
           if (prefix) {
               prefix += ': ';
           }
           this.addButton(prefix + block.title, block.url); 
        }
    } 

    private makeContentPageInit(): void {
        this.addButton(this.Home, '0');
        if (this.lastPage && this.lastPage!=='1') {
           this.lastLevels = this.convertLevels(this.lastPage);
           const block = this.findCurrentBlockStart(this.lastLevels);
           if (block && block.url) {
                this.addButton(this.RecentPage, block.url);
           } 
        } else {
           this.lastPage = '';
        }
        if (this.numberOfBlocks <= this.minExpandingThreshold) {
              this.makeTreeAllInOneOpenState(this.allBlocks, true);
        } else {
              this.makeTreeAllInOneOpenState(this.allBlocks, false);
              this.makeTreeSpecialBranchOpen(this.allBlocks, 0, this.lastLevels);
        }
    }

    private makeTreeAllInOneOpenState(blocks: SpnEditBlocks[], isOpen: boolean): void {
        const n = blocks && blocks.length;
        if (!n) {
            return;
        }
        for(let i=0;i<n;i++) {
             blocks[i].isOpen = isOpen;
             this.makeTreeAllInOneOpenState(blocks[i].kids, isOpen);
        }
    }

    private makeTreeSpecialBranchOpen(blocks: SpnEditBlocks[],level:number, levels:number[]): void {
        let block = blocks[levels[level]-1];
        if (block) {
            block.isOpen = true;
            this.makeTreeSpecialBranchOpen(block.kids, level+1, levels);
        }
    }

    private setCurrentPage(page:string): void {
        this.buttonList = [];
        this.rollerCoaster.currentPage = page || '';
        if (this.rollerCoaster.currentPage==='content') {
             this.makeContentPageInit();
             this.rollerCoaster.updatePopupVisibility();
             return;
        }
        this.currentLevels = this.convertLevels(this.rollerCoaster.currentPage);
        this.currentBlock = this.findCurrentBlockStart(this.currentLevels);
        if (!this.currentBlock) {
           this.rollerCoaster.currentPage = '0';
           this.currentBlock = this.allBlocks[0];
           this.currentLevels = [1];
           this.data = '';
           this.title = '';
        } else {
           this.data = window["dvbtoa"](this.currentBlock.info);
           this.title = this.currentBlock.title;
           this.lastPage = this.rollerCoaster.currentPage;
        }
        this.addButton(this.Content, 'content');
        if (this.currentLevels.length>1) {
              this.addButton(this.Home, '0'); 
            const upBlock:SpnEditBlocks = this.findCurrentBlockStart(this.currentLevels.slice(0,-1));
            if (upBlock) {
               if (this.currentLevels.length>2) {
                  this.addButtonForBlock(this.Up, upBlock);
               }
               let n = this.currentLevels[this.currentLevels.length-1];
               this.addButtonForBlock(this.Next, upBlock.kids[n+1]);
               this.addButtonForBlock(this.Previous, upBlock.kids[n-1]);
            }
        }
        let kids = this.currentBlock.kids;
        if (kids) {
           let n = kids.length;
           if (n>this.maxChildButtonShow) {
               n = this.maxChildButtonShow;
           }
           for(let i=0;i<n;i++) {
                this.addButtonForBlock('', kids[i]);
           } 
        }
        this.rollerCoaster.updatePopupVisibility();
    }

    private findCurrentBlock(blocks: SpnEditBlocks[], level: number, currentLevels: number[]): SpnEditBlocks {
        if (!blocks || !blocks.length) {
            return null;
        }
        const block = blocks[currentLevels[level]];
        if (!block) {
            return null;
        }
        level++;
        return level === currentLevels.length ? block : this.findCurrentBlock(block.kids, level, currentLevels);
    }

    private findCurrentBlockStart(currentLevels: number[]) {
        return this.findCurrentBlock(this.allBlocks, 0, currentLevels);
    }

    private convertLevels(id: string): number[] {
        const levels = id.split("_");
        const result = levels.map((value: string) => parseInt(value, 10));
        return result;
    }


    private getReducedForUrl(title:string):string {
        let res='';
        const n=title.length;
        for(let i=0;i<n;i++) {
           let c=title[i];
           if (c===' ' || c==='_') {
              res+='_';
           } else if ((c>='a' && c<='z' || c>='A' && c<='Z' || c>='0' && c<='9')) {
              res+=c;
           }
        }
        return res;
    }

    private recalculateLevels(blocks: SpnEditBlocks[], level: number, prefix: string, preurl: string): void {
        if (blocks && blocks.length) {
            if (level<=1) {
                preurl = '';
            } 
            blocks.forEach((block: SpnEditBlocks, index: number) => {
                if (!block.title) {
                    block.title = this.blockName + (this.nextId++);
                } else if (block.title.length > this.blockName.length && block.title.substr(0, this.blockName.length) === this.blockName) {
                    const mayId = parseInt(block.title.substring(this.blockName.length), 10);
                    if (mayId && mayId >= this.nextId) {
                        this.nextId = mayId + 1;
                    }
                }
                block.level = level;
                const id = prefix + index;
                block.id = id;
                block.url=preurl + (index+1)+'_'+this.getReducedForUrl(block.title);
                this.numberOfBlocks++;
                this.urlToIdMap[block.url]=block.id; 
                if (block.kids) {
                    this.recalculateLevels(block.kids, level + 1, id + "_",block.url + '/');
                }
                if (block === this.currentBlock) {
                     /* this.currentId = id; */
                     this.currentLevels = this.convertLevels(id);
                }
            });
        }
    }

}                                                                                                                                           