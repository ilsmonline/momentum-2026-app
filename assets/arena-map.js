/* Momentum 2026 · browser-rendered arena diagram.
   Section positions follow the BOS Center's published Main Hall seating layout.
   Row bands reflect data/seating.json; positions are schematic, not architectural.
   No accessibility or security information is included. */
(function(){
 'use strict';
 var NS='http://www.w3.org/2000/svg';
 var order='ABCDEFGHJKLMNPRSTUW'.split('');
 function node(name,attrs,content){
   var n=document.createElementNS(NS,name);
   Object.keys(attrs||{}).forEach(function(k){n.setAttribute(k,String(attrs[k]))});
   if(content!==undefined)n.textContent=String(content);
   return n;
 }
 function add(parent,name,attrs,content){var n=node(name,attrs,content);parent.appendChild(n);return n}
 function txt(parent,x,y,value,size,color,weight,other){
   var attrs={x:x,y:y,'font-family':'Arial,Helvetica,sans-serif','font-size':size,fill:color||'#f5e7da','font-weight':weight||'600'};
   Object.keys(other||{}).forEach(function(k){attrs[k]=other[k]});
   return add(parent,'text',attrs,value)
 }
 function rowsIn(value){
   var v=String(value||'').trim().replace(/-/g,'–');
   var pieces=v.split(',');var found=[];
   pieces.forEach(function(part){
     var p=part.trim(),range=p.split('–'),a=order.indexOf(range[0]),b=order.indexOf(range[1]);
     if(range.length===2&&a>=0&&b>=a){for(var j=a;j<=b;j++)found.push(order[j])}
     else if(order.indexOf(p)>=0)found.push(p)
   });
   return found
 }
 function render(parent,data,selection){
   parent.textContent='';
   var mode=selection&&selection.type==='church'?'church':selection&&selection.type==='open'?'open':'overview';
   var selected=null;
   if(mode==='church'&&data&&Array.isArray(data.churches)){
      selected=data.churches.find(function(c){return c.church===selection.church&&c.city===selection.city})||null;
      if(!selected)mode='overview'
   }
   var mine={},open={};
   if(selected)(selected.allocations||[]).forEach(function(a){
      var key=a.section,rec=mine[key]||(mine[key]={full:new Set(),partial:new Set()});
      rowsIn(a.rows).forEach(function(r){(a.seats?rec.partial:rec.full).add(r)})
   });
   if(data&&data.openSeating)(data.openSeating.sections||[]).forEach(function(a){open[a.section]=new Set(rowsIn(a.rows))});
   var svg=add(parent,'svg',{class:'arena-svg',width:'100%',height:'auto',viewBox:'0 0 1100 865',role:'img','aria-label':selected?'Momentum arena map showing '+selected.church+' reserved seating. Red highlights show assigned rows. Green highlights show open rows.':'Momentum arena map showing open seating and reserved sections. Green areas are designated open seating.'});
   add(svg,'title',{},'Momentum 2026 · BOS Center arena seating');
   add(svg,'desc',{},'Stage at left. Floor seating in the middle and rear seating on right are open. Green row bands are designated open seating. Red row bands indicate the selected church. This is a schematic, not a scale floor plan.');
   var defs=add(svg,'defs');
   var grad=add(defs,'linearGradient',{id:'arena-bg',x1:'0%',y1:'0%',x2:'100%',y2:'100%'});
   add(grad,'stop',{offset:'0%','stop-color':'#35262b'});
   add(grad,'stop',{offset:'100%','stop-color':'#1f1b1d'});
   var pattern=add(defs,'pattern',{id:'partial-band',width:9,height:9,patternUnits:'userSpaceOnUse',patternTransform:'rotate(45)'});
   add(pattern,'rect',{width:9,height:9,fill:'#624047'});
   add(pattern,'rect',{width:3,height:9,fill:'#ed8690'});
   add(svg,'rect',{width:1100,height:865,fill:'url(#arena-bg)'});
   add(svg,'rect',{x:20,y:16,width:1060,height:834,rx:24,fill:'none',stroke:'#69484b','stroke-width':2});
   txt(svg,56,67,'MOMENTUM ’26',34,'#f5e7da','900',{'letter-spacing':1});
   txt(svg,56,98,'FIND YOUR SEATS',17,'#d6a9a2','800',{'letter-spacing':3});
   var banner=selected?selected.church+' · '+selected.city:mode==='open'?'OPEN SEATING':'ARENA SEATING GUIDE';
   txt(svg,1070,66,banner,20,'#f2d7ca','800',{'text-anchor':'end'});
   txt(svg,1070,95,selected?'Highlighted reserved rows are shown in crimson.':mode==='open'?'All floor, rear middle, and green row bands are first-come.':'Green indicates open seating; other rows may be reserved.',13,'#d4bab0','500',{'text-anchor':'end'});
   // Outer hall outline and stage orientation
   add(svg,'rect',{x:35,y:155,width:1030,height:570,rx:28,fill:'#2b2828',stroke:'#6f5756','stroke-width':2});
   add(svg,'rect',{x:56,y:315,width:133,height:250,rx:12,fill:'#151719',stroke:'#b89c8e','stroke-width':2});
   txt(svg,124,446,'STAGE',31,'#f7e8db','900',{'text-anchor':'middle','letter-spacing':4,transform:'rotate(-90 124 446)'});
   add(svg,'rect',{x:206,y:211,width:28,height:168,rx:7,fill:'#534648',stroke:'#85706a'});
   txt(svg,220,402,'101',16,'#d1b2aa','700',{'text-anchor':'middle'});
   add(svg,'rect',{x:206,y:509,width:28,height:168,rx:7,fill:'#534648',stroke:'#85706a'});
   txt(svg,220,498,'120',16,'#d1b2aa','700',{'text-anchor':'middle'});
   var sections=['102','103','104','105','106','119','118','117','116','115'];
   sections.forEach(function(section,i){
      var top=i<5,col=top?i:i-5,x=247+col*120,y=top?192:518,w=110,h=188;
      var g=add(svg,'g',{'data-section':section});
      add(g,'rect',{x:x,y:y,width:w,height:h,rx:7,fill:'#3e3436',stroke:'#9b7b71','stroke-width':1.5});
      var rowHeight=8.15,rowOffset=top?y+12:y+16,reserved=mine[section]||null;
      // Row A faces the central floor for both banks.
      order.forEach(function(row,j){
         var rowIndex=top?order.length-1-j:j,letter=order[rowIndex],yy=rowOffset+j*rowHeight;
         var isMine=reserved&&reserved.full.has(letter),isPartial=reserved&&reserved.partial.has(letter);
         var isOpen=open[section]&&open[section].has(letter);
         var color=isMine?'#dd6375':isPartial?'url(#partial-band)':isOpen?(mode==='church'?'#48766b':'#6dbb9b'):'#55494b';
         add(g,'rect',{x:x+6,y:yy,width:w-12,height:rowHeight-0.75,rx:1.5,fill:color,stroke:isPartial?'#e9a2a1':'none','stroke-width':isPartial?0.8:0});
      });
      add(g,'rect',{x:x+17,y:top?y-38:y+h+2,width:w-34,height:31,rx:7,fill:reserved?'#933949':'#4a393d',stroke:reserved?'#ef97a0':'#a78e83','stroke-width':1.3});
      txt(g,x+w/2,top?y-16:y+h+25,section,22,'#fff2e5','900',{'text-anchor':'middle'});
      add(g,'title',{},'Section '+section+(reserved?' · Your church: '+selected.church:'')+(open[section]?' · Includes designated open rows':''));
   });
   // Entire floor seating is first-come; six clusters schematically reflect the source plan.
   var floor=add(svg,'g',{'aria-label':'All floor seating is open'});
   var fy=[336,402,468];
   fy.forEach(function(y,ri){[0,1].forEach(function(ci){
      var x=260+ci*256;
      add(floor,'rect',{x:x,y:y,width:238,height:58,rx:8,fill:mode==='church'?'#456b60':'#4b8d77',stroke:'#9bc1aa','stroke-width':1.4});
      for(var q=0;q<5;q++){for(var k=0;k<18;k++){add(floor,'circle',{cx:x+12+k*12.6,cy:y+12+q*8.5,r:1.65,fill:'#c0e1c8',opacity:0.8})}}
   })});
   add(floor,'rect',{x:395,y:418,width:236,height:24,rx:6,fill:'#18251f',opacity:.95});
   txt(floor,513,436,'ALL FLOOR SEATING · OPEN',14,'#e7f5e7','900',{'text-anchor':'middle'});
   // Public venue reference identifies back-center modules. Their seating is open.
   [0,1,2].forEach(function(i){
      var x=864,y=319+i*83;
      add(svg,'rect',{x:x,y:y,width:165,height:76,rx:9,fill:mode==='church'?'#466a60':'#4d9078',stroke:'#afc7b4','stroke-width':1.5});
      for(var k=0;k<8;k++)for(var j=0;j<3;j++)add(svg,'circle',{cx:x+13+k*19.5,cy:y+13+j*12,r:2.8,fill:'#d2e6d1',opacity:.8});
   });
   add(svg,'rect',{x:854,y:578,width:185,height:49,rx:9,fill:'#183a31',stroke:'#619783','stroke-width':1.2});
   txt(svg,946,597,'REAR MIDDLE',14,'#e6f7eb','900',{'text-anchor':'middle'});
   txt(svg,946,615,'OPEN SEATING',13,'#e6f7eb','900',{'text-anchor':'middle'});
   // Map legend and disclaimers.
   add(svg,'line',{x1:54,y1:754,x2:1045,y2:754,stroke:'#634d4c','stroke-width':1});
   add(svg,'rect',{x:55,y:773,width:20,height:19,rx:4,fill:'#da6072'});
   txt(svg,86,789,'YOUR CHURCH',16,'#e6c5c4','800');
   add(svg,'rect',{x:314,y:773,width:20,height:19,rx:4,fill:'#67b498'});
   txt(svg,345,789,'OPEN SEATING',16,'#e2d4c7','800');
   add(svg,'rect',{x:595,y:773,width:20,height:19,rx:4,fill:'#57484b'});
   txt(svg,626,789,'OTHER / RESERVED',16,'#d3c4b9','800');
   txt(svg,55,830,'ILLUSTRATIVE MAP · ROW BANDS ARE SCHEMATIC · FOLLOW POSTED SECTION SIGNS',13,'#bda89e','700');
   return svg
 }
 window.MomentumArena={render:render};
})();