const assert = require('assert')
const PasswordHelper = require('../helpers/passwordHelper.js')

const SENHA = '123'
const HASH = '$2b$04$Cf2qLhHPVwJ383JP/kIteu6WFsMtg.JzTO2MBTvpPsDmmIU0dv0p6'
describe('UserHelper test suite', function () {
    it('deve gerar um hash a partir de uma senha', async () => {
        const result = await PasswordHelper.hashPassword(SENHA)
        assert.ok(result.length > 10)
    })
    it('deve comparar uma senha e seu hash', async () => {
        const result = await PasswordHelper.comparePassword(SENHA, HASH)
        assert.ok(result)
    })
});
