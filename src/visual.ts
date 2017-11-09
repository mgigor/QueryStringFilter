module powerbi.extensibility.visual {
    "use strict";
    
    export class Visual implements IVisual {
        private target: HTMLElement;
        private selectionManager: ISelectionManager;
        private host: IVisualHost;
        private initExecuted: boolean = false;

        private queryParamName;

        constructor(options: VisualConstructorOptions) {
            this.target = options.element;
            this.host = options.host;
            this.selectionManager = options.host.createSelectionManager();
        }       
        
        public update(options: VisualUpdateOptions) {
            
            let displayNameField = options.dataViews[0].categorical.categories[0].source.displayName; 
            let regex = new RegExp(displayNameField.concat("=([^&]*)"));
            this.queryParamName = regex.exec(document.referrer)[1];

            if(!this.initExecuted){
                this.init(options);
            }
       
        }

        public init(options: VisualUpdateOptions) {
            let selectionIds: any = {};
            let category;
            let values;
                
            if (!options ||
                !options.dataViews ||
                !options.dataViews[0] ||
                !options.dataViews[0].categorical ||
                !options.dataViews[0].categorical.categories ||
                !options.dataViews[0].categorical.categories[0]) {
                return;
            }
            
            selectionIds = {};
            category = options.dataViews[0].categorical.categories[0];
            values = category.values;
            values.forEach((item: number, index: number) => {
                selectionIds[item] = this.host.createSelectionIdBuilder().withCategory(category, index).createSelectionId();                                   
                this.selectionManager.clear();
                this.selectionManager.select(selectionIds[this.queryParamName]).then((ids: ISelectionId[]) => {
                });
                
                this.selectionManager.applySelectionFilter();
            })

            this.initExecuted = true;

        }
    }    
}

// example used:   http://blog.jongallant.com/2017/03/powerbi-custom-slicer/