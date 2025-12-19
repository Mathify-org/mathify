-- Insert achievement definitions
INSERT INTO public.achievements (id, name, description, icon, category, requirement_type, requirement_value, xp_reward) VALUES
('first_game', 'First Steps', 'Complete your first game', 'star', 'general', 'games_played', 1, 50),
('games_10', 'Getting Started', 'Play 10 games', 'target', 'general', 'games_played', 10, 100),
('games_50', 'Dedicated Learner', 'Play 50 games', 'trophy', 'general', 'games_played', 50, 250),
('games_100', 'Math Enthusiast', 'Play 100 games', 'award', 'general', 'games_played', 100, 500),
('correct_100', 'Century Club', 'Answer 100 questions correctly', 'zap', 'accuracy', 'correct_answers', 100, 150),
('correct_500', 'Knowledge Seeker', 'Answer 500 questions correctly', 'medal', 'accuracy', 'correct_answers', 500, 400),
('correct_1000', 'Math Master', 'Answer 1000 questions correctly', 'crown', 'accuracy', 'correct_answers', 1000, 750),
('streak_3', 'On Track', 'Maintain a 3-day streak', 'flame', 'streaks', 'streak', 3, 75),
('streak_7', 'Week Warrior', 'Maintain a 7-day streak', 'flame', 'streaks', 'streak', 7, 200),
('streak_30', 'Monthly Champion', 'Maintain a 30-day streak', 'flame', 'streaks', 'streak', 30, 1000),
('xp_500', 'Rising Star', 'Earn 500 XP', 'sparkles', 'xp', 'total_xp', 500, 100),
('xp_2000', 'Shining Bright', 'Earn 2000 XP', 'sparkles', 'xp', 'total_xp', 2000, 300),
('xp_10000', 'Supernova', 'Earn 10000 XP', 'sparkles', 'xp', 'total_xp', 10000, 1000),
('explorer_3', 'Explorer', 'Try 3 different games', 'target', 'exploration', 'unique_games', 3, 100),
('explorer_5', 'Adventurer', 'Try 5 different games', 'target', 'exploration', 'unique_games', 5, 200),
('explorer_10', 'Trailblazer', 'Try 10 different games', 'trophy', 'exploration', 'unique_games', 10, 500)
ON CONFLICT (id) DO NOTHING;