import { Injectable } from '@nestjs/common';

import { v4 } from 'uuid';

import { Cart, CartItem } from '../models';
import { Client, Pool }  from 'pg';
import { count } from 'console';


@Injectable()
export class CartService {
  private userCarts: Record<string, Cart> = {};
  client: Pool = null;
  constructor() {
    this.client = new Pool({
      user: 'postgres',
      host: '',
      database: 'postgres',
      password: '',
      port: 5432,
    });
  }

  async findByUserId(userId: string): Promise<Cart> {
    //await this.client.connect()
    const res = await this.client.query(`
    select ci.cart_id, ci.product_id, ci.count 
    from carts c join cart_items ci on c.id = ci.cart_id 
    where c.user_id = $1`, [userId]);
    if(res.rows.length) {
      const cart: Cart = {
        id: res.rows[0].cart_id,
        items: res.rows.map(it => {
          const item: CartItem = {product: {id: it.product_id, price: 0}, count: it.count};
        return item})
      }
      return cart;
    }

    //await this.client.end()
  return null;

    
  }

  async createByUserId(userId: string): Promise<Cart> {
    //await this.client.connect();
    const res = await this.client.query(`insert into carts(user_id, created_at,updated_at)
    values ($1, current_timestamp,current_timestamp) returning id`, [userId]) 

    console.log('res', res.rows[0]);

    //await this.client.end();
    const id = v4(v4());
    const userCart = {
      id,
      items: [],
    };

    this.userCarts[ userId ] = userCart;

    return userCart;
  }

  async findOrCreateByUserId(userId: string): Promise<Cart> {
    const userCart = await this.findByUserId(userId);

    if (userCart) {
      return userCart;
    }

    return await this.createByUserId(userId);
  }

  async updateByUserId(userId: string, { items }: Cart): Promise<Cart> {
    const { id, ...rest } = await this.findOrCreateByUserId(userId);
    
    const updatedCart = {
      id,
      ...rest,
      items: [ ...items ],
    }

    this.userCarts[ userId ] = { ...updatedCart };

    return { ...updatedCart };
  }

  removeByUserId(userId): void {
    this.userCarts[ userId ] = null;
  }

}
