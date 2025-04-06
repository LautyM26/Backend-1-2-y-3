export default class GenericDAO {
    async getById(id)           { throw new Error('Not implemented') }
    async getAll(filter = {})   { throw new Error('Not implemented') }
    async create(data)          { throw new Error('Not implemented') }
    async update(id, data)      { throw new Error('Not implemented') }
    async delete(id)            { throw new Error('Not implemented') }
  }  