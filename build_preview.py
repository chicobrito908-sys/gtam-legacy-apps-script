import os, re

style_path  = r'C:\Users\Usuário\.gemini\antigravity\scratch\escalante-pro\style.html'
script_path = r'C:\Users\Usuário\.gemini\antigravity\scratch\escalante-pro\script.html'
index_path  = r'C:\Users\Usuário\.gemini\antigravity\scratch\escalante-pro\index.html'
out_path    = r'C:\Users\Usuário\.gemini\antigravity\scratch\escalante-pro\preview.html'

style  = open(style_path,  encoding='utf-8').read()
script = open(script_path, encoding='utf-8').read()
index  = open(index_path,  encoding='utf-8').read()

mock_api = """function todayStr(){return new Date().toLocaleDateString('sv-SE');}
var MOCK={
  efetivo:[
    {id:1, nome:'FRANCISCO WILSON DE OLIVEIRA BRITO', nome_de_guerra:'SI W BRITO', matricula:'', posto_graduacao:'Subinspetor', tipo_escala:'24x72', grupo_turno:'TURNO B', antiguidade:1, ativo:true, data_admissao:'2026-03-29', observacoes:'Carga Inicial'},
    {id:2, nome:'LEONARDO MAIA CUNHA BEZERRA', nome_de_guerra:'GD L MAIA', matricula:'', posto_graduacao:'GM', tipo_escala:'24x72', grupo_turno:'TURNO B', antiguidade:2, ativo:true, data_admissao:'2026-03-29', observacoes:'Carga Inicial'},
    {id:3, nome:'LUCAS DE SOUSA BENEVIDES', nome_de_guerra:'GD L BENEVIDES', matricula:'', posto_graduacao:'GM', tipo_escala:'24x72', grupo_turno:'TURNO B', antiguidade:3, ativo:true, data_admissao:'2026-03-29', observacoes:'Carga Inicial'},
    {id:4, nome:'PAULO EDERSON LIMA SOARES', nome_de_guerra:'GD EDERSON', matricula:'', posto_graduacao:'GM', tipo_escala:'24x72', grupo_turno:'TURNO B', antiguidade:4, ativo:true, data_admissao:'2026-03-29', observacoes:'Carga Inicial'},
    {id:5, nome:'CARLOS MATHEUS ALMEIDA PESSOA', nome_de_guerra:'GD C MATHEUS', matricula:'', posto_graduacao:'GM', tipo_escala:'24x72', grupo_turno:'TURNO B', antiguidade:5, ativo:true, data_admissao:'2026-03-29', observacoes:'Carga Inicial'},
    {id:6, nome:'JOSE GILSON DE LIMA BEZERRA', nome_de_guerra:'GD GILSON', matricula:'', posto_graduacao:'GM', tipo_escala:'24x72', grupo_turno:'TURNO B', antiguidade:6, ativo:true, data_admissao:'2026-03-29', observacoes:'Carga Inicial'},
    {id:7, nome:'ALUIZIO COSTA DO AMARAL DOS SANTOS', nome_de_guerra:'GD ALUÍZIO COSTA', matricula:'', posto_graduacao:'GM', tipo_escala:'24x72', grupo_turno:'TURNO B', antiguidade:7, ativo:true, data_admissao:'2026-03-29', observacoes:'Carga Inicial'},
    {id:8, nome:'THIAGO DE CASTRO COELHO', nome_de_guerra:'GD T CASTRO', matricula:'', posto_graduacao:'GM', tipo_escala:'24x72', grupo_turno:'TURNO B', antiguidade:8, ativo:true, data_admissao:'2026-03-29', observacoes:'Carga Inicial'},
    {id:9, nome:'FRANCISCO CLERTON MOTA FERREIRA', nome_de_guerra:'GD MOTTA', matricula:'', posto_graduacao:'GM', tipo_escala:'24x72', grupo_turno:'TURNO B', antiguidade:9, ativo:true, data_admissao:'2026-03-29', observacoes:'Carga Inicial'},
    {id:10, nome:'FRANCISCO JEFFERSON VASCONCELOS DE SÁ', nome_de_guerra:'GD J VASCONCELOS', matricula:'', posto_graduacao:'GM', tipo_escala:'24x72', grupo_turno:'TURNO B', antiguidade:10, ativo:true, data_admissao:'2026-03-29', observacoes:'Carga Inicial'},
    {id:11, nome:'FRANCISCO ANTÔNIO DOS SANTOS SILVA', nome_de_guerra:'GD F A SILVA', matricula:'', posto_graduacao:'GM', tipo_escala:'2x2', grupo_turno:'TURNO B II', antiguidade:11, ativo:true, data_admissao:'2026-03-29', observacoes:'Carga Inicial'},
    {id:12, nome:'GEOVANNI MAÉRCIO DA PONTE', nome_de_guerra:'GD MAÉRCIO', matricula:'', posto_graduacao:'GM', tipo_escala:'2x2', grupo_turno:'TURNO B II', antiguidade:12, ativo:true, data_admissao:'2026-03-29', observacoes:'Carga Inicial'},
    {id:13, nome:'SILVESTRE MENDES PEREIRA', nome_de_guerra:'GD SILVESTRE', matricula:'', posto_graduacao:'GM', tipo_escala:'2x2', grupo_turno:'TURNO A II', antiguidade:13, ativo:true, data_admissao:'2026-03-29', observacoes:'Carga Inicial'},
    {id:14, nome:'ROBERIO ALVES FELIX', nome_de_guerra:'GD ROBÉRIO FELIX', matricula:'', posto_graduacao:'GM', tipo_escala:'2x2', grupo_turno:'TURNO A II', antiguidade:14, ativo:true, data_admissao:'2026-03-29', observacoes:'Carga Inicial'},
    {id:15, nome:'WILSON DO ESPIRITO S. BATISTA RAMOS', nome_de_guerra:'GD WILSON BATISTA', matricula:'', posto_graduacao:'GM', tipo_escala:'2x2', grupo_turno:'TURNO B II', antiguidade:15, ativo:true, data_admissao:'2026-03-29', observacoes:'Carga Inicial'},
    {id:16, nome:'PAULO ANDRE DOS SANTOS QUEIROZ', nome_de_guerra:'GD PAULO ANDRÉ', matricula:'', posto_graduacao:'GM', tipo_escala:'2x2', grupo_turno:'TURNO A II', antiguidade:16, ativo:true, data_admissao:'2026-03-29', observacoes:'Carga Inicial'},
    {id:17, nome:'JAMISON DO NASCIMENTO QUEIROZ', nome_de_guerra:'GD JAMISSON', matricula:'', posto_graduacao:'GM', tipo_escala:'2x2', grupo_turno:'TURNO A II', antiguidade:17, ativo:true, data_admissao:'2026-03-29', observacoes:'Carga Inicial'},
    {id:18, nome:'FRANCISCO ANDERSON LIMA DA SILVA', nome_de_guerra:'GD F LIMA', matricula:'', posto_graduacao:'GM', tipo_escala:'2x2', grupo_turno:'TURNO B II', antiguidade:18, ativo:true, data_admissao:'2026-03-29', observacoes:'Carga Inicial'},
    {id:19, nome:'ALISSON CESAR ALBUQUERQUE NOGUEIRA', nome_de_guerra:'GD ALISSON CÉSAR', matricula:'', posto_graduacao:'GM', tipo_escala:'2x2', grupo_turno:'TURNO B II', antiguidade:19, ativo:true, data_admissao:'2026-03-29', observacoes:'Carga Inicial'},
    {id:20, nome:'ANDERSON RODRIGUES LOPES', nome_de_guerra:'GD ANDERSON LOPES', matricula:'', posto_graduacao:'GM', tipo_escala:'2x2', grupo_turno:'TURNO A II', antiguidade:20, ativo:true, data_admissao:'2026-03-29', observacoes:'Carga Inicial'},
    {id:21, nome:'WALTER SALES TEIXEIRA SOUSA', nome_de_guerra:'GD WALTER SALES', matricula:'', posto_graduacao:'GM', tipo_escala:'2x2', grupo_turno:'TURNO A II', antiguidade:21, ativo:true, data_admissao:'2026-03-29', observacoes:'Carga Inicial'},
    {id:22, nome:'MAURO CESAR VIEIRA DA SILVA', nome_de_guerra:'GD MAURO CÉSAR', matricula:'', posto_graduacao:'GM', tipo_escala:'2x2', grupo_turno:'TURNO B II', antiguidade:22, ativo:true, data_admissao:'2026-03-29', observacoes:'Carga Inicial'},
    {id:23, nome:'JADSON DAMASCENO MARQUES', nome_de_guerra:'GD JADSON', matricula:'', posto_graduacao:'GM', tipo_escala:'2x2', grupo_turno:'TURNO A II', antiguidade:23, ativo:true, data_admissao:'2026-03-29', observacoes:'Carga Inicial'},
    {id:24, nome:'ISAÍAS LIMA CHAVES', nome_de_guerra:'GD ISAÍAS LIMA', matricula:'', posto_graduacao:'GM', tipo_escala:'2x2', grupo_turno:'TURNO A II', antiguidade:24, ativo:true, data_admissao:'2026-03-29', observacoes:'Carga Inicial'},
    {id:25, nome:'MARCIO JOSE FELIX DOS SANTOS', nome_de_guerra:'GD J FÉLIX', matricula:'', posto_graduacao:'GM', tipo_escala:'2x2', grupo_turno:'TURNO A II', antiguidade:25, ativo:true, data_admissao:'2026-03-29', observacoes:'Carga Inicial'},
    {id:26, nome:'KAIO STENIO TARGINO SILVEIRA', nome_de_guerra:'GD KAIO STENIO', matricula:'', posto_graduacao:'GM', tipo_escala:'2x2', grupo_turno:'TURNO B II', antiguidade:26, ativo:true, data_admissao:'2026-03-29', observacoes:'Carga Inicial'},
    {id:27, nome:'FELIPE ROCHA DA SILVA', nome_de_guerra:'GD F SILVA', matricula:'', posto_graduacao:'GM', tipo_escala:'2x2', grupo_turno:'TURNO B II', antiguidade:27, ativo:true, data_admissao:'2026-03-29', observacoes:'Carga Inicial'},
    {id:28, nome:'PAULO VICTOR MOURA DA SILVA', nome_de_guerra:'GD VICTOR MOURA', matricula:'', posto_graduacao:'GM', tipo_escala:'2x2', grupo_turno:'TURNO B II', antiguidade:28, ativo:true, data_admissao:'2026-03-29', observacoes:'Carga Inicial'}
  ],
  escalas:[
    {id:1,data:todayStr(),efetivo_id:1,turno:'SERVIÇO',funcao:'01 - Batedor',status:'CONFIRMADO',observacoes:''},
    {id:2,data:todayStr(),efetivo_id:2,turno:'SERVIÇO',funcao:'02 - Ala',status:'CONFIRMADO',observacoes:''},
    {id:3,data:todayStr(),efetivo_id:3,turno:'SERVIÇO',funcao:'03 - Escolta',status:'CONFIRMADO',observacoes:''},
    {id:4,data:todayStr(),efetivo_id:4,turno:'SERVIÇO',funcao:'04 - Garupa',status:'CONFIRMADO',observacoes:''}
  ],
  plantoes:[],
  afastamentos:[],
  ferias:[],
  faltas:[],
  bancoHoras:[]
};
function api(action,data,cb){
  var _sp=document.getElementById('spinOv');if(_sp)_sp.classList.add('on');
  setTimeout(function(){
    if(_sp)_sp.classList.remove('on');
    var hj=todayStr(),em30=new Date();em30.setDate(em30.getDate()+30);
    var em30s=em30.toLocaleDateString('sv-SE'),r;
    if(action==='getEfetivo'){r=MOCK.efetivo;}
    else if(action==='getEscalas'){r=data&&data.mes?MOCK.escalas.filter(function(e){var d=new Date(e.data);return (d.getMonth()+1)==data.mes&&d.getFullYear()==data.ano;}):MOCK.escalas;}
    else if(action==='getPlantoes'){r=data&&data.mes?MOCK.plantoes.filter(function(p){var d=new Date(p.data);return (d.getMonth()+1)==data.mes&&d.getFullYear()==data.ano;}):MOCK.plantoes;}
    else if(action==='getAfastamentos'){r=MOCK.afastamentos;}
    else if(action==='getFerias'){r=MOCK.ferias;}
    else if(action==='getFaltas'){r=MOCK.faltas;}
    else if(action==='getBancoHoras'){r=MOCK.bancoHoras;}
    else if(action==='getDashboard'){
      var afAt=MOCK.afastamentos.filter(function(a){return a.status==='ATIVO'&&a.data_inicio<=hj&&a.data_fim>=hj;});
      var ferP=MOCK.ferias.filter(function(f){return f.status==='AGENDADO'&&f.data_inicio>=hj&&f.data_inicio<=em30s;});
      r={hoje:hj,totalEfetivo:MOCK.efetivo.filter(function(e){return e.ativo;}).length,afastAtivos:afAt.length,feriasProx:ferP.length,
        escalaHoje:MOCK.escalas.filter(function(e){return e.data===hj;}),
        plantoesHoje:MOCK.plantoes.filter(function(p){return p.data===hj;}),
        afastamentos:afAt,ferias:ferP,efetivo:MOCK.efetivo.filter(function(e){return e.ativo;}),saldos:{},
        totalFaltasMes:MOCK.faltas.filter(function(f){var d=new Date(f.data),n=new Date(hj);return d.getMonth()===n.getMonth()&&d.getFullYear()===n.getFullYear();}).length};
    }
    else if(action==='addEfetivo'){var ne=Object.assign({},data,{id:Date.now(),ativo:true});MOCK.efetivo.push(ne);r={success:true,id:ne.id};}
    else if(action==='updateEfetivo'){var idx=MOCK.efetivo.findIndex(function(e){return String(e.id)===String(data.id);});if(idx>=0)MOCK.efetivo[idx]=Object.assign({},MOCK.efetivo[idx],data);r={success:true};}
    else if(action==='toggleEfetivo'){var ef=MOCK.efetivo.find(function(x){return String(x.id)===String(data.id);});if(ef){ef.ativo=!ef.ativo;r={success:true,ativo:ef.ativo};}else r={success:false};}
    else if(action==='addEscala'){MOCK.escalas.push(Object.assign({},data,{id:Date.now(),status:'CONFIRMADO'}));r={success:true};}
    else if(action==='deleteEscala'){var idx=MOCK.escalas.findIndex(function(e){return String(e.id)===String(data.id);});if(idx>=0)MOCK.escalas.splice(idx,1);r={success:true};}
    else if(action==='addPlantao'){MOCK.plantoes.push(Object.assign({},data,{id:Date.now()}));r={success:true};}
    else if(action==='deletePlantao'){var idx=MOCK.plantoes.findIndex(function(p){return String(p.id)===String(data.id);});if(idx>=0)MOCK.plantoes.splice(idx,1);r={success:true};}
    else if(action==='addAfastamento'){var nd1=data.data_inicio,nd2=data.data_fim,dias=Math.ceil((new Date(nd2)-new Date(nd1))/86400000)+1;MOCK.afastamentos.push(Object.assign({},data,{id:Date.now(),dias:dias,status:'ATIVO'}));r={success:true};}
    else if(action==='encerrarAfastamento'){var af=MOCK.afastamentos.find(function(a){return String(a.id)===String(data.id);});if(af)af.status='ENCERRADO';r={success:true};}
    else if(action==='addFerias'){var nd1=data.data_inicio,nd2=data.data_fim,dias=Math.ceil((new Date(nd2)-new Date(nd1))/86400000)+1;MOCK.ferias.push(Object.assign({},data,{id:Date.now(),saldo_total:30,dias_gozados:dias,status:'AGENDADO'}));r={success:true};}
    else if(action==='deleteFerias'){var idx=MOCK.ferias.findIndex(function(f){return String(f.id)===String(data.id);});if(idx>=0)MOCK.ferias.splice(idx,1);r={success:true};}
    else if(action==='addFalta'){MOCK.faltas.push(Object.assign({},data,{id:Date.now(),status:'REGISTRADO'}));r={success:true};}
    else if(action==='deleteFalta'){var idx=MOCK.faltas.findIndex(function(f){return String(f.id)===String(data.id);});if(idx>=0)MOCK.faltas.splice(idx,1);r={success:true};}
    else if(action==='addBancoHoras'){MOCK.bancoHoras.push(Object.assign({},data,{id:Date.now(),data_registro:hj}));r={success:true};}
    else if(action==='deleteBancoHoras'){var idx=MOCK.bancoHoras.findIndex(function(b){return String(b.id)===String(data.id);});if(idx>=0)MOCK.bancoHoras.splice(idx,1);r={success:true};}
    else if(action==='loginUsuario'){
      if(data.usuario==='admin'&&data.senha==='admin'){r={success:true,user:{id:1,nome:'Comandante',usuario:'admin',nivel:'admin'}};}
      else{r={error:'Usuário ou senha incorretos.'};}
    }
    else{r={};}
    cb(r);
  },60);
}"""

# Patch: replace the original api() function in script.html
script_patched = re.sub(
    r'function api\(action, data, cb\) \{[\s\S]*?^\}',
    mock_api,
    script,
    count=1,
    flags=re.MULTILINE
)

# Combine
preview = index.replace("<?!= include('style'); ?>", style)
preview = preview.replace("<?!= include('script'); ?>", script_patched)

with open(out_path, 'w', encoding='utf-8') as f:
    f.write(preview)

print('Build preview.html OK')
