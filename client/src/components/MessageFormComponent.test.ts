import {assert} from 'chai';

import {MessageFormComponent}  from './MessageFormComponent';

describe('testing events of message form page',()=>{
    const state ={
        username:'test',
        text:'test123'
    }
    let messageFormInstance =new MessageFormComponent({});
    messageFormInstance.state={...state}
  
    it('should call validateEmptyValue',()=>{
       const instance= messageFormInstance.validateEmptyValue('target1','hhh');
       assert.strictEqual(instance.length,0);
    });

    it('should call handleChange',()=>{
        const target = {target:{value:'test',name:'username'}}
      const instance= messageFormInstance.handleChange(target);
      assert.strictEqual(messageFormInstance.state.username,'test');
   });

    
});

