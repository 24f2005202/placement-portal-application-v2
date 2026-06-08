def roles_list(roles):                      # roles= [<Role 1>, <Role 2>,..]
    role_list = []
    for role in roles:
        role_list.append(role.name)
    return role_list                         # roles_list= ['admin', 'user']