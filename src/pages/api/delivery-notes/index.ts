import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import {
  authorizationValidationMiddleware,
  errorHandlerMiddleware,
  notificationHandlerMiddleware,
} from 'server/middlewares';
import { deliveryNoteValidationSchema } from 'validationSchema/delivery-notes';
import { convertQueryToPrismaUtil, getOrderByOptions, parseQueryParams } from 'server/utils';
import { getServerSession } from '@roq/nextjs';
import { GetManyQueryOptions } from 'interfaces';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getDeliveryNotes();
    case 'POST':
      return createDeliveryNote();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getDeliveryNotes() {
    const {
      limit: _limit,
      offset: _offset,
      order,
      ...query
    } = parseQueryParams(req.query) as Partial<GetManyQueryOptions>;
    const limit = parseInt(_limit as string, 10) || 20;
    const offset = parseInt(_offset as string, 10) || 0;
    const response = await prisma.delivery_note
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findManyPaginated({
        ...convertQueryToPrismaUtil(query, 'delivery_note'),
        take: limit,
        skip: offset,
        ...(order?.length && {
          orderBy: getOrderByOptions(order),
        }),
      });
    return res.status(200).json(response);
  }

  async function createDeliveryNote() {
    await deliveryNoteValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.delivery_item?.length > 0) {
      const create_delivery_item = body.delivery_item;
      body.delivery_item = {
        create: create_delivery_item,
      };
    } else {
      delete body.delivery_item;
    }
    if (body?.excel_import?.length > 0) {
      const create_excel_import = body.excel_import;
      body.excel_import = {
        create: create_excel_import,
      };
    } else {
      delete body.excel_import;
    }
    if (body?.invalid_note?.length > 0) {
      const create_invalid_note = body.invalid_note;
      body.invalid_note = {
        create: create_invalid_note,
      };
    } else {
      delete body.invalid_note;
    }
    const data = await prisma.delivery_note.create({
      data: body,
    });
    await notificationHandlerMiddleware(req, data.id);
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
