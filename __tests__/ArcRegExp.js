const is = require('arc-is');
const ArcRegExp = require('../index');

describe('ArcRegExp tests',()=>{
   it('should evaluate to a ArgRegExp string if cast to a string, and show inheritance to RegExp if prototype chain is checked',()=>{
       const rx = new ArcRegExp(/h([^o]{3})o/);
       expect(is(rx,true)).toBe('ArcRegExp');
       expect(is(rx)).toBe('regexp');
   });

   it('should throw Errors if a ArcRegExp function is used that required global flag to be off',()=>{
       const rx = new ArcRegExp(/h([^o]{3})o/g);
       const str = 'something';
       expect(()=>{ rx.matchAll(str); }).toThrow();
       expect(()=>{ rx.matchAndReplace(str); }).toThrow();
       expect(()=>{ rx.replaceCallback(str); }).toThrow();
   });

    it('should throw TypeErrors if a ArcRegExp function is used with invalid arguments',()=>{
        const rx = new ArcRegExp(/h([^o]{3})o/);
        expect(()=>{ rx.matchAll({}); }).toThrow(TypeError);
        expect(()=>{ rx.matchAndReplace({}); }).toThrow(TypeError);
        expect(()=>{ rx.replaceCallback({}); }).toThrow(TypeError);
        expect(()=>{ rx.replaceCallback('hi',{}); }).toThrow(TypeError);
    });

   it('should accept a string, isolate all matches, and return all sub results on those matches',()=>{
       const rx = new ArcRegExp(/h([^o]{3})o/);
       const results = rx.matchAll('hello, hallo, hacko, pello, mello, mallo, sallo, heedo');
       expect(results).toEqual([
           ['hello','ell'],
           ['hallo','all'],
           ['hacko','ack'],
           ['heedo','eed']
       ]);
   });

    it('should accept a string, and return no matches if nothing matched',()=>{
        const rx = new ArcRegExp(/h([^o]{3})o/);
        const results = rx.matchAll('why');
        expect(results).toEqual([]);
    });

    it('should accept a string, isolate all matches, and run a replace on each isolated match',()=>{
        const rx = new ArcRegExp(/h([^o]{3})o/);
        const result = rx.matchAndReplace('hello, hallo, hacko, pello, mello, mallo, sallo, heedo','hello');
        expect(result.replaced).toBe('hello, hello, hello, pello, mello, mallo, sallo, hello');
        expect(result.matches).toEqual([
            ['hello','ell'],
            ['hallo','all'],
            ['hacko','ack'],
            ['heedo','eed']
        ]);
    });

    it('should accept a string, and if no matches are found, return the same string and an empty array of matches',()=>{
        const rx = new ArcRegExp(/h([^o]{3})o/);
        const result = rx.matchAndReplace('why','hello');
        expect(result.replaced).toBe('why');
        expect(result.matches).toEqual([]);
    });

    it('should accept a string, and if no replace value is passed in, should remove all matches instead',()=>{
        const rx = new ArcRegExp(/h([^o]{3})o/);
        const result = rx.matchAndReplace('hello, hallo, hacko, pello, mello, mallo, sallo, heedo');
        expect(result.replaced).toBe(', , , pello, mello, mallo, sallo, ');
        expect(result.matches).toEqual([
            ['hello','ell'],
            ['hallo','all'],
            ['hacko','ack'],
            ['heedo','eed']
        ]);
    });

    it('should accept a string, and if a limit is set, only perform operation until limit is met',()=>{
        const rx = new ArcRegExp(/h([^o]{3})o/);
        const result = rx.matchAndReplace('hello, hallo, hacko, pello, mello, mallo, sallo, heedo', 'hello', 2);
        expect(result.replaced).toBe('hello, hello, hacko, pello, mello, mallo, sallo, heedo');
        expect(result.matches).toEqual([
            ['hello','ell'],
            ['hallo','all']
        ]);
    });

    it('should accept a string and a function, isolate all matches, call the callback for each one, and replace the isolated value with the return value of the callback',()=>{
        const callback = (match) => {
            if(match[1].substr(1) === 'll'){
                return 'hello';
            }
            return 'ho';
        };
        let result = {};
        const rx = new ArcRegExp(/h([^o]{3})o/);
        result = rx.replaceCallback('hello, hallo, hacko, mello, and other things',callback);
        expect(result.replaced).toBe('hello, hello, ho, mello, and other things');
        expect(result.matches).toEqual([
            ['hello','ell'],
            ['hallo','all'],
            ['hacko','ack']
        ]);

        result = rx.replaceCallback('hello, hallo',callback);
        expect(result.replaced).toBe('hello, hello');
        expect(result.matches).toEqual([
            ['hello','ell'],
            ['hallo','all']
        ]);
    });

    it('should take a ArcRegExp object and return the same object',()=>{
        const rx = new ArcRegExp(/hi/);
        expect(ArcRegExp.wrap(rx)).toBe(rx);
    });

    it('should take a native RegExp object and return an ArcRegExp object with the same pattern',()=>{
        const rx = new RegExp(/hi/);
        const arx = ArcRegExp.wrap(rx);
        expect(is(arx,true)).toBe('ArcRegExp');
        expect(arx.exec('hi')).toEqual(rx.exec('hi'))
    });

    it('should throw a TypeError if the type being wrapped is not RegExp',()=>{
        expect(()=>{
            ArcRegExp.wrap({});
        }).toThrow(TypeError);
    });

    it('should parse a uri structure fairly simply',()=>{
        const rx = new ArcRegExp(/\/:([^\/]*)/);
        expect(rx.matchAll('/some/:key/of/:val')).toEqual([
            ['/:key','key'],
            ['/:val','val']
        ]);

        const params = {
            key:'cats',
            val:'2'
        };

        const result = rx.replaceCallback('/pets/:key/:val',([match,group])=>{
            return `/${params[group]}`;
        });

        expect(result.replaced).toBe('/pets/cats/2');
        expect(result.matches).toEqual([
            ['/:key','key'],
            ['/:val','val']
        ]); 
    });
});