const grabCompanies=()=>new Promise((res,rej)=>{
    return window.fetch('https://acme-users-api-rev.herokuapp.com/api/companies')
        .then(response=>response.json())
        .then(jsonData => res(jsonData))
        .catch(e => rej(e));
})

const grabProducts=()=>new Promise((res,rej)=>{
    return window.fetch('https://acme-users-api-rev.herokuapp.com/api/products')
        .then(response=>response.json())
        .then(jsonData => res(jsonData))
        .catch(e => rej(e));
})

const grabOfferings=()=>new Promise((res,rej)=>{
    return window.fetch('https://acme-users-api-rev.herokuapp.com/api/offerings')
        .then(response=>response.json())
        .then(jsonData => res(jsonData))
        .catch(e => rej(e));
})


Promise.all([grabCompanies(),grabProducts(),grabOfferings()]).then(responses=>{
    
    //Destructuring responses into useful constants//
     const [companies,products,offerings]=responses;

    // console.log('companies',companies);
    // console.log('products', products);
    // console.log('offerings',offerings);

    //EXAMPLE
    // const companiesInNewYork=companiesByState(companies,'New York'); 
    // console.log(companiesInNewYork);
    

    const productsInPriceRange=findProductsInPriceRange(products,{min:1,max:5});
    console.log(productsInPriceRange);

    const groupedCompaniesByLetter=groupCompaniesByLetter(companies);
    console.log(groupedCompaniesByLetter);

    const groupedCompaniesByState=groupCompaniesByState(companies);
    console.log(groupedCompaniesByState);

    const processedOfferings=processOfferings(companies,products,offerings);
    console.log(processedOfferings);

    const threeOrMoreOfferings=companiesByNumberOfOfferings(companies,offerings,3);
    console.log(threeOrMoreOfferings);

    const processedProducts=processProducts(products,offerings);
    console.log(processedProducts)

})

//HELPER FUNCTIONS

// EXAMPLE
// const companiesByState=(companies,state)=>companies.filter(company=>company.state===state);

const findProductsInPriceRange=(products,range)=>products.filter(product=>{
    if(product.suggestedPrice>=range.min&&product.suggestedPrice<=range.max)return product
})

const groupCompaniesByLetter=companies=>companies.reduce((accum,company)=>{
    const letter=company.name[0];

    if(accum[letter]){
        accum[letter].push(company)
    }else{
        accum[letter]=[company]
    }
    return accum;
    
},{})

const groupCompaniesByState=companies=>companies.reduce((accum,company)=>{
    const state=company.state;

    if(accum[state]){
        accum[state].push(company)
    }else{
        accum[state]=[company]
    }
    return accum;
    
},{})

const processOfferings=(companies,products,offerings)=>offerings.reduce((accum,offer)=>{
    companies.forEach(company=>{
        if(company.id===offer.companyId){
            offer.company=company;
        }
    })

    products.forEach(product=>{
        if(product.id===offer.productId){
            offer.product=product;
        }
    })
    accum.push(offer);
    return accum;

},[])

const companiesByNumberOfOfferings=(companies,offerings,num)=>{
    return companies.reduce((accum,company)=>{

        offerings.forEach(offer=>{
            if(company.id===offer.companyId){
                if(company.offers){
                    company.offers.push(offer)
                }else{
                    company.offers=[offer]
                }
            }
        })

        accum.push(company);
        return accum;

    },[]).filter(company=>{
        if(company.offers.length>=num)return company

    })
}

const processProducts = (products,offerings)=>products.reduce((accum, product)=>{
    let numOffers=0;
    let totalPrice=0

    offerings.forEach(offer=>{
        if(offer.productId===product.id){
            totalPrice+=offer.price;
            numOffers++;
        }
    });


    product.avgPrice=totalPrice/numOffers;

    accum.push(product);
    return accum;

},[])
