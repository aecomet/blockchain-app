import { OrderWithCounter } from '@opensea/seaport-js/lib/types';
import { NextRequest, NextResponse } from 'next/server';

const orderDatas: Array<OrderWithCounter> = [];

export async function POST(request: NextRequest): Promise<NextResponse> {
  const data = (await request.json()) as OrderWithCounter;

  orderDatas.push(data);

  return NextResponse.json(
    {
      message: 'Order created successfully',
      data
    },
    {
      status: 201
    }
  );
}

export async function GET(): Promise<NextResponse> {
  return NextResponse.json(orderDatas);
}

export async function DELETE(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);

  const id = searchParams.get('id');

  if (!id || isNaN(Number(id))) {
    return NextResponse.json(
      {
        message: 'ERROR No index'
      },
      {
        status: 400
      }
    );
  }

  const res = orderDatas.splice(Number(id), 1);
  if (res.length != 1) {
    return NextResponse.json(
      {
        message: 'ERROR No data'
      },
      {
        status: 404
      }
    );
  }

  return NextResponse.json(
    {
      message: 'Order deleted successfully'
    },
    {
      status: 202
    }
  );
}
