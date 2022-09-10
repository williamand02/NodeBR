//importamos um módulo interno do node.js
const util = require('util');
const obterEnderecoAsync = util.promisify(obterEndereco);

function obterUsuario() {
    return new Promise(function resolvePromise(resolve, reject) {
        setTimeout(() => {
            // return reject(new Error("DEU RUIM DE VERDADE!"));
            return resolve({
                id: 1,
                nome: 'Aladin',
                dataNascimento: new Date()
            })
        }, 1000)
    })
}

function obterTelefone(idUsuario) {
    return new Promise(function resolvePromise(resolve, reject) {
        setTimeout(() => {
            return resolve({
                telefone: '11990011',
                ddd: 11
            })
        }, 2000);
    })
}

function obterEndereco(idUsuario, callback) {
    setTimeout(() => {
        return callback(null, {
            rua: 'dos bobos',
            numero: 0
        })
    }, 2000);

}
main()
async function main() {
    try {
        console.time('medida-promise')
        const usuario = await obterUsuario()
        // const telefone = await obterTelefone(usuario.id)
        // const endereco = await obterEnderecoAsync(usuario.id)
        const resultado = await Promise.all([
            obterTelefone(usuario.id),
            obterEnderecoAsync(usuario.id)
        ])
        const telefone = resultado[0]
        const endereco = resultado[1]
        console.log(`
        Nome: ${usuario.nome},
        Endereco: ${endereco.rua},${endereco.numero},
        Telefone: (${telefone.ddd})${telefone.telefone}
    `)
        console.timeEnd('medida-promise')
    } catch (error) {
        console.error("Deu ruim", error);
    }
}

// const usuarioPromise = obterUsuario()
//para manipular o sucesso usamos a função .them
//para manipular erros , usamos o .catch
// usuarioPromise
//     .then(function (usuario) {
//         return obterTelefone(usuario.id).then(function (telefone) {
//             return {
//                 usuario,
//                 telefone
//             }
//         })
//     })
//     .then(function ({ usuario, telefone } = resultado) {
//         const enderecoAsync = obterEnderecoAsync(usuario.id);
//         return enderecoAsync.then(function resolveEndereco(endereco) {
//             return {
//                 usuario,
//                 telefone,
//                 endereco
//             }

//         })
//     })
//     .then(function (resultado) {
//         console.log(`
//         Nome: ${resultado.usuario.nome}
//         Endereco: ${resultado.endereco.rua}, ${resultado.endereco.numero}
//         Telefone:(${resultado.telefone.ddd})${resultado.telefone.telefone}
//         `);
//     }).catch(function (error) {
//         console.log("Deu ruim", error)
//     })


// obterUsuario(function resolverUsuario(error, usuario) {
//     if (error) {
//         console.error('DEU RUIM em USUARIO', error);
//         return;
//     }
//     obterTelefone(usuario.id, function resolverUsuario(error1, telefone) {
//         if (error1) {
//             console.error('DEU RUIM em TELEFONE', error)
//             return;
//         }
//         obterEndereco(usuario.id, function resolverUsuario(error2, endereco) {
//             if (error2) {
//                 console.error('DEU RUIM em ENDEREÇO', error)
//                 return;
//             }
//             console.log(`
//             Nome: ${usuario.nome},
//             Endereco: ${endereco.rua},${endereco.numero},
//             Telefone: (${telefone.ddd})${telefone.telefone}
//             `)
//         })
//     })
// });
