import { Injectable } from "@angular/core";
import { SpnEditBlocks } from "../models/spn-edit-block";
import { EditBlockConfig } from "../models/edit-block-config";

@Injectable()
export class SpnEditControl {

    allBlocks: SpnEditBlocks[];
    currentBlock: SpnEditBlocks;
    headerBlocks: SpnEditBlocks[];
    footerBlocks: SpnEditBlocks[];
    editConfig: EditBlockConfig;
    changed = false;
    currentId: string;
    currentLevels: number[];
    nextId = 1;
    mainArea: any;
    moreArea: any;
    readonly blockName: string = "Block ";

    constructor() {
        let mainBlock: SpnEditBlocks = {};
        this.editConfig = window["SpnEditBlockConfig"] as EditBlockConfig;
        if (this.editConfig) {
            this.moreArea = document.getElementById(this.editConfig.moreAreaId);
            if (!this.moreArea) {
                window.console.log("Error: element " + this.editConfig.moreAreaId + " does not exist");
                this.moreArea = {value: ""};
            }
            const mainBlockValue: string = (this.moreArea.value || "").trim();
            try {
                if (mainBlockValue) {
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
                }
            } catch (e) {
                 window.console.log("SpnEditBlockNodes has been reset",e);
            }
            if (typeof mainBlock !== "object") {
                mainBlock = {};
            }
            this.mainArea = document.getElementById(this.editConfig.mainAreaId);
            if (!this.mainArea) {
                window.console.log("Error: element " + this.editConfig.mainAreaId + " does not exist");
                this.mainArea = {value: ""};
            }
            mainBlock.info = this.refineAsSilver(this.mainArea.value);
            if (!mainBlock.title) {
                mainBlock.title = "Main";
            }
            this.allBlocks = [mainBlock];
            this.calculateLevels();
            this.chooseDefaultCurrentBlock();
            window["SpnEditMainSaver"] = this.saveData.bind(this);
        } else {
            window["SpnEditMainSaver"] = () => 0;
        }
    }

    getSpnBlocks(isHeader: boolean): SpnEditBlocks[] {
        return isHeader ? this.headerBlocks : this.footerBlocks;
    }

    chooseDefaultCurrentBlock(): void {
        this.chooseCurrentBlock("0");
    }

    private refineAsSilver(s: string): string {
        if (!s) {
           return "";
        }
        let pre = s.indexOf("<body");
        let preEnd = s.indexOf(">",pre);
        let pos = s.lastIndexOf("</body>");
        if (pre>=0 && preEnd>=0 && pos>preEnd) {
              s = s.substring(preEnd+1, pos);
        }
        return window["dvatob"](s);
    }

    private saveCurrentBlock(): void {
        if (this.currentBlock) {
            const content =this.refineAsSilver(this.editConfig.getContent());
            if (content !== this.currentBlock.info) {
                this.currentBlock.info = content;
                this.changed = true;
            }
        }
    }

    chooseCurrentBlock(currentBlockId: string): void {
        this.saveCurrentBlock();
        const currentLevels = this.convertLevels(currentBlockId);
        const currentBlock = this.findCurrentBlockStart(currentLevels);
        if (!currentBlock || currentBlock.id !== currentBlockId) {
            window.console.log("Error: cannot find ", currentBlockId, this.allBlocks);
            this.calculateLevels();
            return;
        }
        this.currentBlock = currentBlock;
        this.currentId = currentBlockId;
        this.currentLevels = currentLevels;
        if (this.currentBlock) {
            this.editConfig.setContent(window["dvbtoa"](this.currentBlock.info));
        }
        this.separateVisibleBlocks();
    }

    calculateLevels(): void {
        this.recalculateLevels(this.allBlocks, 0, "");
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

    private recalculateLevels(blocks: SpnEditBlocks[], level: number, prefix: string): void {
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
                if (block.kids) {
                    this.recalculateLevels(block.kids, level + 1, id + "_");
                }
                if (block === this.currentBlock) {
                     this.currentId = id;
                     this.currentLevels = this.convertLevels(id);
                }
            });
        }
    }

    private cleanLevels(blocks: SpnEditBlocks[]): void {
        if (blocks && blocks.length) {
            blocks.forEach((block: SpnEditBlocks) => {
                delete block.id;
                delete block.level;
                delete block.isOpen;
                if (block.kids) {
                    this.cleanLevels(block.kids);
                }
            });
        }
    }

    createBlock(currentBlockId: string) {
        const currentLevels = this.convertLevels(currentBlockId);
        const currentBlock = this.findCurrentBlockStart(currentLevels);
        if (!currentBlock || !currentBlock.id) {
                window.console.log("Error in structure",currentBlockId,this.allBlocks, currentLevels);
                return;
        }
        if (!currentBlock.kids) {
            currentBlock.kids = [];
        }
        const id = currentBlock.id + "_" + currentBlock.kids.length;
        currentBlock.kids.push({id: id, info: "", title: ""});
        this.calculateLevels();
        this.chooseCurrentBlock(id);
    }

    saveData(): void {
        this.saveCurrentBlock();
        if (!this.allBlocks[0].title) {
            this.allBlocks[0].title = "Main";
        }
        this.cleanLevels(this.allBlocks);
        const mainBlock = Object.assign({}, this.allBlocks[0]);
        this.mainArea.value = window["dvbtoa"](mainBlock.info);
        delete mainBlock.info;
        this.moreArea.value = JSON.stringify(mainBlock);
        this.calculateLevels();
        if (this.currentBlock) {
            this.chooseCurrentBlock(this.currentBlock.id);
        }
    }

    private separateVisibleBlocks(): void {
        this.headerBlocks = [];
        this.footerBlocks = [];
        this.arrangeVisibleBlocks(this.allBlocks, 0);
    }

    private arrangeVisibleBlocks(blocks: SpnEditBlocks[], level: number): void {
        if (!blocks || level > this.currentLevels.length) {
            return;
        }
        if (level === this.currentLevels.length) {
            for (let i = blocks.length - 1; i >= 0; i--) {
                blocks[i].isOpen = false;
                this.footerBlocks.unshift(blocks[i]);
            }
            return;
        }
        let n =  this.currentLevels[level];
        const m = blocks.length;
        if (n > m) {
            n = m;
        }
        for (let i = 0; i < n; i++) {
            blocks[i].isOpen = false;
            this.headerBlocks.push(blocks[i]);
        }
        if (n < m && level + 1 < this.currentLevels.length) {
            blocks[n].isOpen = true;
            this.headerBlocks.push(blocks[n]);
        }
        for (let i = m - 1; i > n; i--) {
            blocks[i].isOpen = false;
            this.footerBlocks.unshift(blocks[i]);
        }
        if (blocks[n]) {
            this.arrangeVisibleBlocks(blocks[n].kids, level + 1);
        }
    }

    deleteCurrentBlock(): void {
        if (this.currentBlock && this.currentBlock.id) {
            const ids = this.convertLevels(this.currentBlock.id);
            let last: number = ids.pop();
            const parent = this.findCurrentBlockStart(ids);
            if (parent && parent.kids && last < parent.kids.length) {
                 if (parent.kids.length === 1) {
                    delete parent.kids;
                    this.chooseCurrentBlock(parent.id);
                 } else {
                    if (last + 1 === parent.kids.length) {
                        parent.kids.pop();
                        last--;
                    } else {
                        parent.kids.splice(last, 1);
                        this.recalculateLevels(parent.kids, parent.level + 1, parent.id + "_");
                    }
                    this.chooseCurrentBlock(parent.id + "_" + last);
                }
            }
        }
    }
}
