export interface IPoolMemberInput {
  shipId: string;
  cbBefore: number;
}

export interface IPoolMemberResult extends IPoolMemberInput {
  cbAfter: number;
}

export class PoolAllocator {
//  Greedy Allocation algorithm  FuelEU Pool.
  public static allocate(members: IPoolMemberInput[]): IPoolMemberResult[] {
//  pool balance
    const totalBalance = members.reduce((sum, m) => sum + m.cbBefore, 0);
    
    if (totalBalance < 0) {
      throw new Error("Pool is invalid: Total Compliance Balance of all members is strictly negative.");
    }

//  Separate into surplus and deficit ships
    const surplusShips = members.filter(m => m.cbBefore > 0).map(m => ({ ...m, cbAfter: m.cbBefore }));
    const deficitShips = members.filter(m => m.cbBefore <= 0).map(m => ({ ...m, cbAfter: m.cbBefore }));

//  Greedy allocation - Sort surplus members descending by CB
    surplusShips.sort((a, b) => b.cbBefore - a.cbBefore);

//  Distribute surplus to deficits
    for (const deficitShip of deficitShips) {
      let remainingDeficit = Math.abs(deficitShip.cbAfter);

      for (const surplusShip of surplusShips) {
        if (remainingDeficit === 0) break; 
        if (surplusShip.cbAfter <= 0) continue; 

        const amountToTransfer = Math.min(remainingDeficit, surplusShip.cbAfter);
        
        surplusShip.cbAfter = Number((surplusShip.cbAfter - amountToTransfer).toFixed(2));
        deficitShip.cbAfter = Number((deficitShip.cbAfter + amountToTransfer).toFixed(2));
        
        remainingDeficit = Number((remainingDeficit - amountToTransfer).toFixed(2));
      }
    }

//  Results
    return [...surplusShips, ...deficitShips].map(ship => ({
      shipId: ship.shipId,
      cbBefore: ship.cbBefore,
      cbAfter: ship.cbAfter
    }));
  }
}