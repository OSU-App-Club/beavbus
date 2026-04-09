

class CorvallisTransitAPI {
    

    async getPolyLines() {


        const response = await fetch('https://corvallisbuswest.azurewebsites.net/api/static/')

        console.log(response.json())

        
    }
}

export default CorvallisTransitAPI;