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

@Injectable()
export class SpnViewManagerService {
    readonly Home='Home';
    readonly Up = 'Up';
    readonly Next = 'Next';
    readonly Previous = 'Previous';
    readonly RecentPage = 'Recent Page';
    readonly Content = 'Content';
    data = '';
    title = '';
    minExpandingThreshold = 10;
    numberOfBlocks = 1;
    currentPage = '';
    lastPage = '';
    currentLevels: number[] = [];
    lastLevels: number[] = [];
    urlToIdMap = {
        "content": "0",
    };
    currentBlock: SpnEditBlocks;
    allBlocks: SpnEditBlocks[] = [];
    buttonList: SpnViewButton[] = [{url:"#content",name:"Content"},{url:"#1_Lord_is_my_joy_hope",name:"Lord is my joy, hope"},{url:"#1_Lord_is_my_joy_hope/I_will_praise_you",name:"I will praise you forever"}];
    contentComponentRef: ComponentRef<SpnViewContentComponent>

    constructor(private componentFactoryResolver: ComponentFactoryResolver,
               private appRef: ApplicationRef,
               private injector: Injector) {
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
        document.body.appendChild(domElem);
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
        name = window.dieSeiteUbersetzungen && window.dieSeiteUbersetzungen[name] || name;
        this.buttonList.push({name,url});
    }

    private makeContentPageInit(): void {
        this.addButton(this.Home, '1');
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
              this.makeTreeSpecialBranchOpen(this.allBlocks, 0, this.lastPage);
        }
    }

    private makeTreeAllInOneOpenState(blocks: SpnEditBlocks[], isOpen: boolean): void {
        const n = blocks && blocks.length;
        if (!n) {
            return;
        }
        for(let i=0;i<n;i++) {
             blocks[i].isOpen = isOpen;
             this.makeTreeAllInOneOpenState(blocks[i].kids);
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
        this.currentPage = page || '';
        if (this.currentPage==='0') {
             this.makeContentPageInit();
             return;
        }
        this.currentLevels = this.convertLevels(this.currentPage);
        this.currentBlock = findCurrentBlockStart(this.currentLevels);
        if (!this.currentBlock) {
           this.currentPage = '';
           this.data = '';
           this.title = '';
        } else {
           this.data = this.currentBlock.info;
           this.title = this.currentBlock.title;
           this.lastPage = this.currentPage;
        }
        this.addButton(this.Content, 'content');
        // TODO: as follows
        // check Up button
        // check Next button
        // check Previous button
        // check 5 child buttons
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
                block.url=(index+1)+'_'+this.getReducedForUrl(block.title);
                this.numberOfBlocks++;
                this.urlToIdMap[block.url]=block.id; 
                if (block.kids) {
                    this.recalculateLevels(block.kids, level + 1, id + "_",block.url + '/');
                }
                if (block === this.currentBlock) {
                     this.currentId = id;
                     this.currentLevels = this.convertLevels(id);
                }
            });
        }
    }

}                                                                                                                                           