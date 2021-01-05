use curv::elliptic::curves::traits::*;
use curv::{FE,BigInt};
use std::any::type_name;
use std::ops::Neg;

#[derive(Debug)]
pub struct Matrix {
    f0: BigInt,
    mat: Vec<BigInt>,
    numberRow: usize,
    numberColumn: usize,
}

pub fn build_matrix(t:usize, n:usize,x:&[u32], ownbk:u32) -> Matrix {
    let tempf0 = FE::q();
    let mut tempmat:Vec<BigInt> = Vec::new();
    for i in 0..t{
        tempmat.push(BigInt::ui_pow_ui(ownbk.clone(),i.clone() as u32).modulus(&tempf0.clone()));
    }
    let tempnumberRow : usize = n.clone();
    let tempnumberColumn:usize = t.clone();
    for i in 0..n {
        if ownbk != x[i].clone() {
        for j in 0..t {
            tempmat.push(BigInt::ui_pow_ui(x[i].clone(),j.clone() as u32));
        }}
    }

    Matrix {
        f0: tempf0.clone(),
        mat: tempmat.clone(),
        numberRow: tempnumberRow.clone(),
        numberColumn: tempnumberColumn.clone()
    }
}
pub fn newIdentityMatrix(rank:usize, f0:BigInt)->Matrix{
    let mut tempmat:Vec<BigInt> = Vec::new();
    for i in 0..rank {
        for j in 0..rank {
            if i==j {
                tempmat.push(BigInt::one().clone());
            }
            else {
                tempmat.push(BigInt::zero().clone());
            }
        }
    }
    Matrix {
        f0: f0.clone(),
        numberRow: rank.clone(),
        numberColumn: rank.clone(),
        mat: tempmat.clone()
    }
}
pub fn multiScalar(slice :Vec<BigInt>,scalar: BigInt)->Vec<BigInt> {
    let mut result:Vec<BigInt> = Vec::new();
    for i in 0..slice.len() {
        let value = slice[i].clone()*scalar.clone();
        result.push(value.clone());
    }
    result
}
impl Matrix {
    pub fn Copy(&self)->Matrix{
        let tempf0 = self.f0.clone();
        let tempmat = self.mat.clone();
        let tempnumberRow : usize = self.numberRow.clone();
        let tempnumberColumn:usize = self.numberColumn.clone();
        Matrix {
            f0: tempf0.clone(),
            mat: tempmat.clone(),
            numberRow: tempnumberRow.clone(),
            numberColumn: tempnumberColumn.clone()
        }
    }
    pub fn GetNumberColumn(&self)->usize{
        self.numberColumn
    }
    pub fn GetNumberRow(&self)->usize{
        self.numberRow
    }
    pub fn GetColumn(&self, nIndex: usize)->Vec<BigInt> {
        let mut tempSlice = vec![self.Get(0, nIndex)];
        for i in 1..self.numberRow{
            tempSlice.push(self.Get(i,nIndex));
        }
        tempSlice
        }
    pub fn GetRow(&self, nIndex: usize) -> Vec<BigInt> {
        let mut tempSlice = vec![self.Get(nIndex,0)];
        for i in 1..self.numberRow{
            tempSlice.push(self.Get(nIndex,i));
            }
        tempSlice
    }
    pub fn Get(&self,i:usize, j:usize)->BigInt{
        let index = i*self.numberColumn+j;
        self.mat[index].modulus(&(self.f0))
    }
    pub fn get(&self,i:usize, j:usize)->BigInt{
        self.mat[i*self.numberColumn+j].clone()
    }
    pub fn modInverse(&self,i:usize,j:usize)->BigInt{
        let v: BigInt = self.get(i,j);
        let (_g,s,_t) = v.gcdext(&self.f0);
        s
    }
    pub fn Transpose(&mut self){
        let mut tempmat:Vec<BigInt> = Vec::new();
        for i in 0..self.numberColumn{
            for j in 0..self.numberRow{
                tempmat.push(self.get(j,i));
            }
        }
        self.mat = tempmat.clone();
    }
    pub fn Add(&mut self, matrix: Matrix){
        for i in 0..self.numberRow {
            for j in 0..self.numberColumn {
                let index = i*self.numberColumn+j;
                self.mat[index]=self.mat[index].clone() + matrix.get(i,j); 
            }
        }
    }
    pub fn Multiply(&mut self, matrix: Matrix){
        for i in 0..self.numberRow {
            for j in 0..self.numberColumn{
                let mut tempValue:BigInt = BigInt::zero();
                for k in 0..self.numberColumn {
                    tempValue = tempValue + self.get(i,k)*matrix.get(k,j);
                }
                self.mat[i*self.numberColumn+j] = tempValue
            }
        }
        self.numberColumn = matrix.numberColumn;
    }
    pub fn modulus(&mut self){
        for i in 0..self.numberRow {
            for j in 0..self.numberColumn {
                let index = i*self.numberColumn+j;
                self.mat[index] = self.mat[index].modulus(&(self.f0));
            }
        }
    }
    pub fn swapRow(&mut self, nIndexRow1:usize, nIndexRow2:usize){
        let tempmatrix = self.Copy();
        for i in 0..self.numberColumn {
            let a = nIndexRow1*self.numberColumn+i;
            let b = nIndexRow2*tempmatrix.numberColumn+i;
            let c = nIndexRow2*self.numberColumn+i;
            let d = nIndexRow1*tempmatrix.numberColumn+i;
            let tempb = tempmatrix.mat[b].clone();
            let tempd = tempmatrix.mat[d].clone();
            self.mat[a] = tempb.clone();
            self.mat[c] = tempd.clone();
        }
    }
    pub fn swapColumn(&mut self, nIndexColumn1:usize, nIndexColumn2:usize){
        let tempmatrix = self.Copy();
        for i in 0..self.numberRow {
            
            self.mat[i*self.numberColumn+nIndexColumn1] = tempmatrix.mat[i*tempmatrix.numberColumn+nIndexColumn2].clone();
            self.mat[i*self.numberColumn+nIndexColumn2] = tempmatrix.mat[i*tempmatrix.numberColumn+nIndexColumn1].clone();
                }
    }
    
    pub fn Inverse(&self)->Matrix {
        let (mut upperMatrix,lowerMatrix,_r) = self.getGaussElimination();
        let copyLowerMatrix = lowerMatrix.Copy();
        upperMatrix.Transpose();
        let (tempUpperResult,mut tempLowerResult,_s) = upperMatrix.getGaussElimination();
        let mut tempResult = tempLowerResult.multiInverseDiagonal(tempUpperResult);
        tempResult.Transpose();
        tempResult.Multiply(copyLowerMatrix);
        tempResult.modulus();
        tempResult
    }
    
    pub fn Determinant(&mut self) -> BigInt {
        self.modulus();
        let (upperMatrix,_s,permutationTimes) = self.getGaussElimination();
        let mut result:BigInt = BigInt::one();
        for i in 0..self.numberRow {
            result = result.clone() * upperMatrix.get(i,i).clone();
            result = result.modulus(&(self.f0));
            }
        if permutationTimes%2 ==1 {
            result = result.neg();
        }
        result.modulus(&self.f0);
        result
    }
    pub fn getGaussElimination(&self) -> (Matrix, Matrix,i64){
        let mut lower = newIdentityMatrix(self.numberRow.clone(),self.f0.clone());
        let mut upper = self.Copy();
        let permutationTimes:i64 = 0;
        for i in 0..self.numberRow {
            let mut changeIndex = upper.getNonZeroCoefficientByRow(i,i);
            if i != changeIndex {
                upper.swapRow(i, changeIndex);
                lower.swapRow(i, changeIndex);
            }
            let mut inverse = upper.modInverse(i,i);

            for j in i.clone()+1..self.numberRow{
                let mut tempValue = upper.get(j,i).clone() * inverse.clone();
                let mut inverseDiagonalComponent = tempValue.neg();
                let mut rowI = upper.GetRow(i);
                let mut rowJ = upper.GetRow(j);

                let mut tempResultASlice = multiScalar(rowI, inverseDiagonalComponent.clone());
                for k in 0..rowJ.clone().len(){
                    let tempsss = rowJ[k].clone() + tempResultASlice[k].clone();
                    let index = k.clone() + j.clone()*upper.numberColumn.clone();
                    upper.mat[index] = tempsss;
                }
                let mut rowlowerI = lower.GetRow(i);
                let mut rowlowerJ = lower.GetRow(j);
                let mut tempResultASlicelower = multiScalar(rowlowerI, inverseDiagonalComponent.clone());
                for k in 0..rowlowerJ.clone().len(){
                        let tempsss = rowlowerJ[k].clone() + tempResultASlicelower[k].clone();
                        let index = k.clone() + j.clone()*lower.numberColumn.clone();                                                         lower.mat[index] = tempsss;
                        }
                }
            }
            upper.modulus();
            lower.modulus();
            (upper,lower,permutationTimes)
        }
        fn getNonZeroCoefficientByRow(&self, columnIdx: usize, fromRowIndex: usize) -> usize {
            for i in fromRowIndex..self.numberRow.clone() {
                if self.Get(i, columnIdx).clone().is_zero() == false {
                    return i;
                }
            }
            let a:usize = 0;
            return a.clone();
        }
        
    pub fn multiInverseDiagonal(&mut self,diagonal: Matrix)->Matrix{
        let rank = self.numberRow;
        for i in 0..rank {
            let inverse = diagonal.modInverse(i,i);
            for j in 0..rank {
                let t = self.get(i,j).clone() * inverse.clone();
                let index = i.clone() * self.numberColumn.clone() + j.clone();
                self.mat[index] = t;
            }
        }
        Matrix {
            f0: self.f0.clone(),
            mat: self.mat.clone(),
            numberRow: self.numberRow.clone(),
            numberColumn: self.numberColumn.clone()
        }
    }
    pub fn Pseudoinverse(&self)->Matrix {
       if(self.numberRow.clone()==self.numberColumn.clone()){
        self.Inverse()
       } else {
       let mut copy = self.Copy();
       let mut copyTranspose = self.Copy();
       copyTranspose.Transpose();
       let mut copyTran = self.Copy();
       copyTran.Copy();
       copyTranspose.Multiply(copy);
       let mut sem = copyTranspose.Copy();
       let mut insem = sem.Inverse();
       insem.Multiply(copyTran);
       let mut result = insem.Copy();
       result.modulus();
       result.Copy()
       }
    }
}
pub fn get_delta(matrix:Matrix,x:u32,share: BigInt)->BigInt{
    let mut result = BigInt::zero();
    let mut xpower = BigInt::one();
    let x = BigInt::from(x.clone());
    for i in 0..matrix.numberRow.clone() {
        result = result.clone() + matrix.mat[i.clone()*matrix.numberColumn].clone()*xpower.clone();
        xpower = xpower.clone() * x.clone();
    }
    result.modulus(&matrix.f0);
    let mut a = result.clone() * share.clone();
    a.modulus(&matrix.f0);
    a
    
}
