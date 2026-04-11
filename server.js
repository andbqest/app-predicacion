import express from "express";
import cors from "cors";
const app=express();
app.use(cors());
app.use(express.json());
const KEY="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";
const MODELOS=["arcee-ai/trinity-large-preview:free","nvidia/nemotron-3-super-120b-a12b:free"];
async function llamarIA(texto){
const hoy=new Date().toISOString().split("T")[0];
const prompt="Respond ONLY with valid JSON no markdown. Extract: {nombre,sector,metodo_contacto,fecha_contacto,temas_interes,observaciones,estado,proxima_accion,fecha_proxima_accion}. Today:"+hoy+". Text:";
for(const modelo of MODELOS){
try{
console.log("Intentando:",modelo);
const r=await fetch("https://openrouter.ai/api/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json","Authorization":"Bearer "+KEY},body:JSON.stringify({model:modelo,max_tokens:1000,messages:[{role:"user",content:prompt+" "+texto}]})});
const d=await r.json();
if(!d.choices||!d.choices[0]){console.log("Fallido:",JSON.stringify(d).substring(0,100));continue;}
const content=d.choices[0].message.content.trim();
const start=content.indexOf("{");
const end=content.lastIndexOf("}");
if(start===-1||end===-1)continue;
return JSON.parse(content.substring(start,end+1));
}catch(e){console.log("Error:",e.message);}
}
throw new Error("Sin modelos");
}
app.post("/api/parsear",async(req,res)=>{
try{res.json(await llamarIA(req.body.texto));}catch(e){res.status(500).json({error:e.message});}
});
app.listen(3001,()=>console.log("ok 3001"));