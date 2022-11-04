import is from 'arc-is';

class ArcRegExp extends RegExp {
    matchAll(_string){
        if(this.global){
            throw new Error('ArcRegExp.matchAll requires the global flag to be false, otherwise unexpected results will occur');
        }
        if(is(_string) !== 'string'){
            throw new TypeError('ArcRegExp.matchAll only accepts a valid string to search against');
        }

        const matches = [];
        let reduceString = _string;
        while(reduceString){
            let search = this.exec(reduceString);
            if(!search){ break; }
            let tArray = [];
            for(let i=0;i<search.length;i++){
                tArray.push(search[i]);
            }
            matches.push(tArray);
            reduceString = reduceString.substr(search['index']+search[0].length);
        }
        return matches;
    }

    matchAndReplace(_string,_replace,_limit){
        if(this.global){
            throw new Error('ArcRegExp.matchAndReplace requires the global flag to be false, otherwise unexpected results will occur');
        }

        if(is(_string) !== 'string'){
            throw new TypeError('ArcRegExp.matchAndReplace requires a valid string to search against');
        }

        const matches = [];
        const replace = (is(_replace) === 'string' ? _replace : '');
        let reduceString = _string;
        let newString = '';
        let count = 0;

        while(reduceString){
            let search = this.exec(reduceString);
            if(!search){ break; }
            let tArray = [];
            for(let i=0;i<search.length;i++){
                tArray.push(search[i]);
            }
            matches.push(tArray);
            newString = newString+reduceString.substr(0,search['index'])+replace;
            reduceString = reduceString.substr(search['index']+search[0].length);
            count++;
            if(_limit && count >= _limit){
                break;
            }
        }
        if(reduceString){
            newString = newString+reduceString;
        }
        return {replaced:newString,matches};
    }

    replaceCallback(_string,_callback){
        if(this.global){
            throw new Error('ArcRegExp.replaceCallback requires the global flag to be false, otherwise unexpected results will occur');
        }

        if(is(_string) !== 'string'){
            throw new TypeError('ArcRegExp.replaceCallback requires a valid string to search against');
        }

        if(is(_callback) !== 'function'){
            throw new TypeError('ArcRegExp.replaceCallback requires a valid callback as a second argument');
        }

        const matches = [];
        let newString = '';
        let reduceString = _string;

        while(reduceString){
            let search = this.exec(reduceString);
            if(!search){ break; }
            let tArray = [];
            for(let i=0;i<search.length;i++){
                tArray.push(search[i]);
            }
            matches.push(tArray);
            newString = newString+reduceString.substr(0,search['index'])+_callback(tArray);
            reduceString = reduceString.substr(search['index']+search[0].length);
        }
        if(reduceString){
            newString = newString+reduceString;
        }
        return {replaced:newString,matches};
    }

    toString(){
        return '[object '+this.constructor.name+']';
    }

    static wrap(_RegExp){
        if(is(_RegExp,true) === 'ArcRegExp'){
            return _RegExp;
        }
        else if(is(_RegExp) === 'regexp'){
            return new ArcRegExp(_RegExp.source);
        }
        else{
            throw new TypeError('Cannot wrap value. Must evaluate to a native RegExp.');
        }
    }
}

export default ArcRegExp;