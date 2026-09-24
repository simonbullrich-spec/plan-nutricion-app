// Datos del plan, copiados tal cual de referencia/plan-comidas-recomposicion.html

// [nombre, unidad, kcal, proteína, carbos, grasa] por unidad
export const F = {
  huevo:["Huevo","u",72,6.3,0.4,4.8],
  tostada:["Tostada de pan","u",80,2.7,15,1],
  cremon:["Queso cremón","g",3,0.2,0.01,0.24],
  manzana:["Manzana","u",95,0.5,25,0.3],
  banana:["Banana","u",105,1.3,27,0.4],
  mandarina:["Mandarina","u",47,0.7,12,0.3],
  milapollo:["Milanesa de pollo al horno","g",2.2,0.24,0.12,0.075],
  milacarne:["Milanesa de carne al horno","g",2.3,0.23,0.12,0.095],
  bife:["Bife magro (nalga, cuadril, lomo)","g",2.0,0.28,0,0.095],
  arroz:["Arroz cocido","g",1.3,0.027,0.28,0.003],
  fideos:["Fideos cocidos","g",1.58,0.058,0.31,0.009],
  choclo:["Choclo en granos","g",0.96,0.034,0.21,0.015],
  ensalada:["Lechuga, tomate y zanahoria","porción",50,2,10,0.3],
  aceite:["Aceite de oliva","cdita",45,0,0,5],
  yogcol:["Yogur casero colado","g",0.95,0.09,0.04,0.05],
  granola:["Granola","g",4.5,0.1,0.65,0.15],
  fsecos:["Frutos secos","g",6,0.18,0.2,0.53],
  bebible:["Yogur bebible descremado","ml",0.55,0.032,0.09,0.003],
  barrita:["Barrita casera (receta abajo)","u",185,4.7,24,7.8]
};
export const it=(k,q)=>({k,q});
const o=(n,items,note)=>({n,items,note});

// ---------- bancos de opciones ----------
export const P={
 DES:[o("Huevos con tostadas",[it("huevo",3),it("tostada",2),it("cremon",30),it("manzana",1)],"Revueltos o a la plancha, con una gota de aceite. Mate o café sin azúcar."),
      o("Yogur, granola y huevos duros",[it("yogcol",200),it("granola",30),it("banana",1),it("huevo",2)]),
      o("Tostadas y yogur bebible",[it("bebible",300),it("tostada",2),it("cremon",30),it("huevo",2)],"La opción rápida para días apurados.")],
 DES_PARTIDO:[o("Tostadas, banana y yogur bebible",[it("tostada",3),it("cremon",20),it("banana",1),it("bebible",300),it("mandarina",1)],"3 h antes del partido. Poca grasa y poca fibra: se digiere rápido."),
      o("Arroz con huevo",[it("arroz",250),it("huevo",2),it("mandarina",1)],"Clásico pre-partido si tolerás comida salada a la mañana.")],
 MM:[o("Barrita casera + manzana",[it("barrita",1),it("manzana",1)]),
     o("Frutos secos + banana",[it("fsecos",30),it("banana",1)]),
     o("Huevos duros + mandarinas",[it("huevo",2),it("mandarina",2)],"Llevá las mandarinas enteras y los huevos ya pelados en un táper chico."),
     o("Frutos secos + mandarinas",[it("fsecos",20),it("mandarina",2)]),
     o("Yogur bebible",[it("bebible",300)],"Solo si lo llevás en bolsa térmica o hay heladera.")],
 ALM_E:[o("Milanesa de pollo con arroz",[it("milapollo",150),it("arroz",250),it("ensalada",1),it("choclo",100),it("aceite",1)]),
        o("Milanesa de carne con fideos",[it("milacarne",150),it("fideos",250),it("ensalada",1),it("aceite",1)],"Fideos con tomate triturado o aceite y 1 cda de queso rallado."),
        o("Bife con arroz y choclo",[it("bife",150),it("arroz",250),it("ensalada",1),it("choclo",100),it("aceite",1)])],
 TUP_E:[o("Ensalada de arroz con milanesa de carne",[it("milacarne",150),it("arroz",250),it("choclo",100),it("ensalada",1),it("aceite",1)],"Arroz frío con choclo, zanahoria rallada y tomate; la milanesa cortada en tiras arriba."),
        o("Fideos con milanesa de pollo",[it("milapollo",150),it("fideos",220),it("ensalada",1),it("aceite",1)],"Si hay microondas, calentá solo los fideos y la mila."),
        o("Bife en tiras con arroz y choclo",[it("bife",150),it("arroz",250),it("choclo",100),it("ensalada",1),it("aceite",1)])],
 TUP_D:[o("Milanesa de pollo con ensalada de arroz",[it("milapollo",150),it("arroz",150),it("choclo",100),it("ensalada",1),it("aceite",1)]),
        o("Bife en tiras con fideos",[it("bife",150),it("fideos",140),it("ensalada",1),it("aceite",1)]),
        o("Ensalada completa con huevo",[it("milacarne",120),it("arroz",150),it("huevo",2),it("ensalada",1),it("aceite",1)],"Arroz, huevo duro picado, tomate, zanahoria y la mila en cubos.")],
 MER_PRE:[o("Yogur colado con granola",[it("yogcol",200),it("granola",40),it("banana",1)],"1–2 h antes de entrenar."),
          o("Tostadas y yogur bebible",[it("tostada",2),it("cremon",30),it("bebible",250),it("banana",1)],"Más carbohidratos y fácil de llevar si salís de casa directo al gym.")],
 MER_D:[o("Yogur colado con granola",[it("yogcol",200),it("granola",30),it("mandarina",2)]),
        o("Tostadas con queso y yogur bebible",[it("tostada",2),it("cremon",30),it("bebible",250)])],
 ENTRE:[o("Yogur bebible + banana",[it("bebible",300),it("banana",1)],"Líquido y rápido: carbohidratos para el rugby y algo de proteína. Tomalo apenas terminás el gym."),
        o("Barrita casera + banana",[it("barrita",1),it("banana",1)],"Si no tenés dónde enfriar el yogur. Sumá agua."),
        o("Tostada con queso + mandarinas",[it("tostada",1),it("cremon",20),it("mandarina",2)])],
 CEN_POST:[o("Bife con fideos",[it("bife",150),it("fideos",250),it("ensalada",1),it("aceite",1)]),
           o("Milanesa de pollo con arroz",[it("milapollo",150),it("arroz",300),it("ensalada",1),it("aceite",1)]),
           o("Milanesa de carne con fideos",[it("milacarne",150),it("fideos",250),it("ensalada",1),it("aceite",1)])],
 CEN_D:[o("Bife con fideos",[it("bife",150),it("fideos",150),it("ensalada",1),it("aceite",1)]),
        o("Milanesa de pollo con arroz",[it("milapollo",150),it("arroz",150),it("ensalada",1),it("aceite",1)]),
        o("Milanesa de carne con fideos",[it("milacarne",150),it("fideos",150),it("ensalada",1),it("aceite",1)])],
 CEN_PRE:[o("Fideos con milanesa de pollo",[it("milapollo",130),it("fideos",300),it("aceite",1),it("mandarina",1)],"Plato grande de fideos, proteína moderada, sin ensalada abundante (poca fibra antes del partido)."),
          o("Arroz con bife",[it("bife",130),it("arroz",300),it("aceite",1),it("mandarina",1)])],
 PRE_KICK:[o("Banana",[it("banana",1)],"60–90 min antes del partido, con agua."),
           o("Barrita casera",[it("barrita",1)])],
 VESTUARIO:[o("Yogur bebible + fruta",[it("bebible",300),it("mandarina",1)],"Apenas termina el partido, antes del tercer tiempo."),
            o("Yogur bebible + barrita",[it("bebible",300),it("barrita",1)])],
 ALM_POST:[o("Bife con arroz",[it("bife",180),it("arroz",300),it("ensalada",1),it("aceite",1)]),
           o("Milanesa de pollo con fideos",[it("milapollo",180),it("fideos",280),it("ensalada",1),it("aceite",1)])],
 NOCHE:[o("Yogur colado + mandarina",[it("yogcol",150),it("mandarina",1)],"Opcional, si te queda hambre o no llegaste a la proteína."),
        o("Yogur colado + frutos secos",[it("yogcol",150),it("fsecos",10)])]
};

// ---------- semana ----------
// s: [hora, nombre, banco, opción por defecto, nota del horario]
export const W=[
 {d:"Lun",title:"Lunes, gimnasio a la noche",train:[["Gimnasio","19:00–20:20"]],water:["11:00","15:00","18:45","21:30"],acts:[["Gimnasio 19:00–20:20","m"]],
  tips:["La cena funciona como comida post-gym: no hace falta un snack extra en el medio."],
  s:[["08:00","Desayuno","DES",0],["13:00","Almuerzo","ALM_E",0],["17:30","Merienda pre-gym","MER_PRE",0],["21:00","Cena post-gym","CEN_POST",0],["23:00","Antes de dormir","NOCHE",0]]},
 {d:"Mar",title:"Martes, facultad y doble turno",train:[["Gimnasio","antes de las 19:00"],["Rugby","19:00–22:30"]],water:["10:00","13:30","17:00","19:00","22:30"],acts:[["Facultad 9:00–12:30","u"],["Gimnasio","m"],["Rugby 19:00–22:30","m"]],
  tips:["El día más exigente de la semana: más carbohidratos que cualquier otro.","Si el gym arranca a otra hora, corré la merienda para que quede 1–2 h antes.","Llevá agua y el snack del entremedio en la mochila desde casa."],
  s:[["07:30","Desayuno","DES",0],["10:30","Media mañana (facultad)","MM",0],["13:30","Almuerzo","ALM_E",1],["16:00","Merienda pre-gym","MER_PRE",0],["18:50","Entre gym y rugby","ENTRE",0],["23:00","Cena post-rugby","CEN_POST",1,"Tarde pero completa: es la comida que más ayuda a recuperar."]]},
 {d:"Mié",title:"Miércoles, facultad y descanso",train:[],water:["11:00","16:00","20:30"],acts:[["Facultad, almuerzo en táper","u"],["Descanso","r"]],
  tips:["Táper: cociná y guardá en la heladera apenas se enfría (no más de 2 h a temperatura ambiente), y llevalo en bolsa térmica. El arroz cocido es de los que más riesgo tiene si queda horas afuera.","Aderezo aparte para que la ensalada no se ablande."],
  s:[["08:00","Desayuno","DES",0],["10:30","Media mañana (facultad)","MM",3],["13:00","Almuerzo en táper","TUP_D",0],["17:00","Merienda","MER_D",0],["21:00","Cena","CEN_D",0]]},
 {d:"Jue",title:"Jueves, facultad y doble turno",train:[["Gimnasio","18:00"],["Rugby","20:30"]],water:["10:30","14:00","17:30","19:30","22:30"],acts:[["Facultad, almuerzo en táper","u"],["Gimnasio 18:00","m"],["Rugby 20:30","m"]],
  tips:["Entre gym y rugby tenés cerca de una hora: alcanza para el snack y llegar tranquilo.","Mismo cuidado con el táper que el miércoles: bolsa térmica y aderezo aparte."],
  s:[["07:30","Desayuno","DES",0],["10:30","Media mañana (facultad)","MM",2],["13:00","Almuerzo en táper","TUP_E",0],["16:30","Merienda pre-gym","MER_PRE",0],["19:30","Entre gym y rugby","ENTRE",0],["23:00","Cena post-rugby","CEN_POST",0,"Tarde pero completa: es la comida que más ayuda a recuperar."]]},
 {d:"Vie",title:"Viernes, previa del partido",train:[],water:["11:00","14:30","18:00","21:00"],acts:[["Facultad 9:00–12:00","u"],["Descanso","r"]],
  tips:["Se suben los carbohidratos para llegar al sábado con el glucógeno lleno.","Cena con poca grasa y poca fibra, y nada que no hayas comido antes.","Tomá agua durante todo el día: llegar hidratado se arma desde el viernes."],
  s:[["08:00","Desayuno","DES",0],["10:30","Media mañana (facultad)","MM",0],["13:00","Almuerzo","ALM_E",0],["17:00","Merienda","MER_PRE",1],["21:00","Cena pre-partido","CEN_PRE",0]]},
 {d:"Sáb",title:"Sábado, partido 11:00",train:[["Partido","11:00"]],water:["09:45","12:45","15:30","18:30","21:30"],acts:[["Partido 11:00","m"]],
  tips:["Desayuno 3 h antes; algo chico 60–90 min antes; agua en el entretiempo.","En el tercer tiempo priorizá comida con proteína. El alcohol después de un esfuerzo así frena la recuperación muscular: si tomás, que sea poco y después de comer.","Almuerzo grande dentro de las 2 h de terminado."],
  s:[["07:45","Desayuno pre-partido","DES_PARTIDO",0],["09:45","Pre-partido","PRE_KICK",0],["12:45","Vestuario","VESTUARIO",0],["14:00","Almuerzo post-partido","ALM_POST",0],["17:30","Merienda","MER_PRE",0],["21:30","Cena","CEN_POST",2]]},
 {d:"Dom",title:"Domingo, recuperación",train:[],water:["12:00","15:30","18:30","21:30"],acts:[["Recuperación","r"],["Posible noche corta","r"]],
  tips:["Si dormiste poco, no bajes la proteína: es el día donde más la necesitás repartida.","Dormir mal da más hambre de cosas dulces. Tené a mano fruta y yogur.","Café o mate hasta las 16 h y, si podés, una siesta de 20–30 min. Hoy intentá acostarte temprano."],
  s:[["10:00","Brunch","DES",0,"Si te levantás tarde, este reemplaza al desayuno."],["14:00","Almuerzo","TUP_D",0],["17:30","Merienda","MER_D",0],["21:00","Cena","CEN_D",0],["22:30","Antes de dormir","NOCHE",1]]}
];

// ---------- gimnasio y agua (termo de 940 ml) ----------
export const TRAIN=[
  [["19:00","Gimnasio","19:00 a 20:20"]],
  [["17:30","Gimnasio","Antes del rugby. Si vas a otra hora, corré la merienda."],["19:00","Rugby","19:00 a 22:30"]],
  [],
  [["18:00","Gimnasio","18:00 a 19:20"],["20:30","Rugby","20:30 en adelante"]],
  [],
  [["11:00","Partido","Kick-off 11:00"]],
  []
];
// [hora límite, nota]
export const WATER=[
  [["11:00"],["15:00"],["18:30","Terminalo antes de arrancar el gym."],["22:00","Durante el gym y con la cena."]],
  [["10:30","En la facu."],["13:30"],["17:00","Antes del gym."],["20:30","Durante el gym y el arranque del rugby."],["23:00","A sorbos en cada pausa del rugby y con la cena."]],
  [["11:00","En la facu."],["16:00"],["21:00"]],
  [["10:30","En la facu."],["14:00"],["17:30","Antes del gym."],["20:30","Durante el gym y entre gym y rugby."],["23:00","A sorbos en cada pausa del rugby y con la cena."]],
  [["11:00","En la facu."],["15:00"],["19:00"],["22:00","Llegar hidratado al partido se arma hoy."]],
  [["09:30","Con el desayuno y camino a la cancha."],["13:00","En la entrada en calor, el entretiempo y el vestuario."],["16:30","Reponer lo que sudaste."],["20:00"],["23:00"]],
  [["12:00","Si hubo tercer tiempo, arrancá temprano."],["15:30"],["19:00"],["22:00"]]
];

export const SNACKS=[
  o("2 huevos duros + 1 fruta",[it("huevo",2),it("manzana",1)]),
  o("Yogur colado + frutos secos",[it("yogcol",150),it("fsecos",15)]),
  o("Barrita casera + manzana",[it("barrita",1),it("manzana",1)],"Ideal para la mochila."),
  o("Yogur bebible grande",[it("bebible",400)]),
  o("Tostada con queso cremón + banana",[it("tostada",1),it("cremon",30),it("banana",1)]),
  o("Frutos secos + mandarinas",[it("fsecos",20),it("mandarina",2)])
];

export const LETTER=["L","M","M","J","V","S","D"];
