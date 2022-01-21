import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import passport from './passport';
import session from 'express-session';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import prisma from './prisma';
import { Config } from '.';

const router = nextConnect<NextApiRequest, NextApiResponse>();

const age: number = 1000 * 60 * 60 * 24 * 30; // 30 days

router.use(session({
  cookie: {
    maxAge: age
  },
  secret: Config.SessionSecret,
  name: 'cwc-session',
  resave: true,
  saveUninitialized: true,
  store: new PrismaSessionStore(
    prisma,
    {
      checkPeriod: 2 * 60 * 1000,  //ms
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }
  )
}));

// Passport
router.use(passport.initialize());
router.use(passport.session());

export default router;