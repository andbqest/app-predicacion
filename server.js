import express from "express";
import cors from "cors";
const app=express();
app.use(cors());
app.use(express.json());
const KEY="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";
app.post("/api/parsear",async(req,res)=>{
const{texto}=req.body;
const hoy=new Date().toISOString().split("T")[0];
const prompt="Respond ONLY with valid JSON no markdown no backticks no explanation. Extract: {nombre,sector,metodo_contacto,fecha_contacto,temas_interes,observaciones,estado,proxima_accion,fecha_proxima_accion}. Today:"+hoy+". Text:";
try{
const r=await fetch("https://openrouter.ai/api/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json","Authorization":"Bearer "+KEY},body:JSON.stringify({model:"arcee-ai/trinity-large-preview:free",max_tokens:1000,messages:[{role:"user",content:prompt+" "+texto}]})});
const d=await r.json();
const content=d.choices[0].message.content.trim();
console.log("content:",content.substring(0,300));
const start=content.indexOf("{");
const end=content.lastIndexOf("}");
if(start===-1||end===-1)throw new Error("no json");
res.json(JSON.parse(content.substring(start,end+1)));
}catch(e){
console.error("err:",e.message);
res.status(500).json({error:e.message});
}
});
app.listen(3001,()=>console.log("ok 3001"));