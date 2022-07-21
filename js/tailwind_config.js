tailwind.config = {
  darkMode:'class'
}


function storageOperations(type){
    
    try{

      const root = document.getElementsByTagName('html')[0];
      let mode = localStorage.getItem('darkThemeMode');

      if(mode==null){mode=false;localStorage.setItem('darkThemeMode',mode);}

      if((type) && (mode=='true')){
        root.classList.toggle('dark');

      }else if(!type){
        root.classList.toggle('dark');
        localStorage.setItem('darkThemeMode',(mode=='false')?true:false);
      }

      document.body.classList.add('transition-colors','duration-800');


    }catch(error){
    }

}

storageOperations(true);
