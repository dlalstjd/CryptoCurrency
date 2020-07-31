import sss from 'shamirs-secret-sharing'

// split secret, n of m
export function split_secret(_secret, n, m){
    const secret = Buffer.from(_secret)
    const shares = sss.split(secret, { shares: n, threshold: m })
    //console.log(shares)
    return shares
}

function generateRandomNumber(max, min){
    return Math.floor(Math.random()*(max-min+1)) + min    
}

// generate random shares
export function generateRandomShare(shares, n){
    var random = generateRandomNumber(n, 1)
    //console.log(random)
    var random_shares = []
    for( var step = 0; step < random; step++){
        if( random + step >= n )
            random_shares.push(shares[(random+step)%n])
        else
            random_shares.push(shares[(random+step)])
    }
    //console.log(random_shares)
    return random_shares
}

// reconstruct secrect from shares
export function reconstruct_secret(shares, m){
    if( shares.length < m){
        console.error("Incorrect threshold")
        return ""
    }
    try{
        const reconstructed = sss.combine(shares)
        return reconstructed
    }catch{
        console.error("Incorrect shares: " + shares)
        return ""
    }
}
