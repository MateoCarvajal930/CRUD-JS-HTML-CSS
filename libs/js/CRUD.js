var newId;
var db=openDatabase("itemDB","1.0","itemDB", 65535);
var validarTabla = false;

function limpiar() { 
    document.getElementById("item").value="";
    document.getElementById("precio").value="";
}

    //ELIMINAR REGISTRO

function borrarR(){
    $(document).one('click','button[type="button"]',function(event){
        let id=this.id;
        var lista=[];
        $("#listaProductos").each(function(){
            var celdas=$(this).find('tr.Reg_'+id);
            celdas.each(function(){
                var registro=$(this).find('span.mid');
                registro.each(function(){
                    lista.push($(this).html())
                });
            });
        });
        nuevoId=lista[0].substr(1);
        db.transaction(function(transaction){
            if(!confirm("Esta seguro de que desea borrar este registro?, no podra recuperarlo.",""))
                return;
            var sql="DELETE FROM tblProductos WHERE id="+nuevoId+";"
            transaction.executeSql(sql,undefined,function(){
                alert("Registro borrado correctamente, por favor, actualice la pagina.")
            },function(transaction, err){
                alert(err.message);
            })
        })
    });
}

//editar registro
function editarR(){
    $(document).one('click','button[type=button]',function(event){
        let id=this.id;
        var lista=[];
        $("#listaProductos").each(function(){
            var celdas=$(this).find('tr.Reg_'+id);
            celdas.each(function(){
                var registro=$(this).find('span');
                registro.each(function(){
                    lista.push($(this).html())
            });
        });
    });
    document.getElementById("item").value=lista[1];
    document.getElementById("precio").value=lista[2].slice(0,-5);
    nuevoId=lista[0].substr(1);
    })
}
//Funcionalidad de los botones

$(function (){
    $("#crear").click(function(){
        db.transaction(function(transaction){
            var sql="CREATE TABLE tblProductos "+
            "(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, "+
            "item VARCHAR(100) NOT NULL, "+
            "precio DECIMAL(5,2) NOT NULL)";
            transaction.executeSql(sql, undefined, function() { 
                alert("Tabla creada con exito");    
                validarTabla=true;
            },function(transaction, err) {
                alert("La tabla ya existe.");
                cargarDatos();
            })
        });    
    });

$("#listar").click(function(){
    cargarDatos();
})

function cargarDatos() {
    $("#listaProductos").children().remove();
    db.transaction(function(transaction){
        var sql="SELECT * FROM tblProductos ORDER BY id DESC";
        transaction.executeSql(sql, undefined, function(transaction,result){
            if(result.rows.length) {
                $("#listaProductos").append('<tr><td>Código</td><td>Producto</td><td>Precio</td><td><td></td><td></td></tr>');
                for(var i=0; i<result.rows.length; i++) {
                    var row=result.rows.item(i);
                    var item=row.item;
                    var id=row.id;
                    var precio=row.precio;  
                    $("#listaProductos").append('<tr id="fila'+id+'" class="Reg_A'+id+'"><td><span class="mid">A'+
                    id+'</span></td><td><span>'+item+'</Span></td><td><span>'+
                    precio+' COP$</span></td><td><button type="button" id="A'+id+'" class="btn btn-success" onclick="editarR()"><img src="libs/img/edit.png"></button></td><td><button type="button" id="A'+id+'"class="btn btn-danger" onclick="borrarR()"><img src="libs/img/delete.png"></button></td></tr>');
                }     
            }else{
                $("#listaProductos").append('<tr><td colspan="5" align="center">No existe ningún registro</td></tr>');
            }
            },function(transaction, err) {
                alert("No existe ninguna tabla.");
            })
        })
    }

    $("#insertar").click(function() {
        var item=$("#item").val();
        var precio=$("#precio").val();
        if(validarTabla==true){
            if(item==""||precio=="")
            alert("los campos no pueden estar vacios.")
            else
            db.transaction(function(transaction) {
                var sql="INSERT INTO tblProductos(item,precio) VALUES(?,?)";
                transaction.executeSql(sql,[item,precio],function() {
                },function(transaction, err) {
                    alert(Err.message);
                })
            })
            limpiar();
            cargarDatos();
        }else
        alert("No existe ninguna tabla.")
    })

    //borrar todo
    $("#borrar").click(function(){
        if(validarTabla==true) {
            if(!confirm("Esta seguro de que desea borrar la tabla?, no podra recuperar su contenido.",""))
                return;
            db.transaction(function(transaction){
                var sql="DROP TABLE tblProductos";
                transaction.executeSql(sql,undefined,function(){
                    alert("Tabla borrada correctamente, por favor, actualice la pagina")
                    validarTabla=false;
                },function(transaction,err){
                    alert(err.message); 
                })
            })
        }else
        alert("No existe ninguna tabla.")
    })

$("#editar").click(function(){
    var nProd=$("#item").val(); 
    var nPrecio=$("#precio").val();
    if(validarTabla==true){
        if(nProd==""||nPrecio=="")
        alert("Los campos no pueden estar vacios.")
        else
        db.transaction(function(transaction){
            var sql="UPDATE tblProductos SET item='"+nProd+"',precio='"+nPrecio+"' WHERE id="+nuevoId+";"
            transaction.executeSql(sql,undefined, function(){
                cargarDatos();
                limpiar();
            },function(transaction,err){
                alert(err.message);
            })
        })
    }else
    alert("No existe ninguna tabla.")

})


})

