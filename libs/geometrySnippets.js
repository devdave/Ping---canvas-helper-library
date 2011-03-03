

function checkIntersection(lineAx1,lineAy1,lineAx2,lineAy2,lineBx1,lineBy1,lineBx2,lineBy2){
  
  var aM, bM, aB, bB;
  var isX=0;
  var isY=0;
  
  if((lineAx2-lineAx1)==0){
    isX=lineAx1;
    bM=(lineBy2-lineBy1)/(lineBx2-lineBx1);
    bB=lineBy2-bM*lineBx2;
    isY=bM*isX+bB;
  }
  else if((lineBx2-lineBx1)==0){
    isX=lineBx1;
    aM=(lineAy2-lineAy1)/(lineAx2-lineAx1);
    aB=lineAy2-aM*lineAx2;
    isY=aM*isX+aB;
  }
  else{
    aM=(lineAy2-lineAy1)/(lineAx2-lineAx1);
    bM=(lineBy2-lineBy1)/(lineBx2-lineBx1);
    aB=lineAy2-aM*lineAx2;
    bB=lineBy2-bM*lineBx2;
    isX=Math.max(((bB-aB)/(aM-bM)),0);
    isY=aM*isX+aB;
  }
  
  return [isX, isY]; 
}

checkIntersection( -3 , 5, 1, 2, -4, 4, 5, 3 );